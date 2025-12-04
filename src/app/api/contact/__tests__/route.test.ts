jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue(true),
  })),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      status: options?.status || 200,
      json: () => Promise.resolve(data),
    })),
  },
  NextRequest: jest.fn().mockImplementation(() => ({
    json: jest.fn().mockResolvedValue({}),
    cookies: {},
    nextUrl: new URL('http://localhost'),
    page: {},
    ua: {},
  })),
}));

import nodemailer from 'nodemailer';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Helper pour créer un mock de requête avec headers
function createMockRequest(body: Record<string, unknown>): Partial<NextRequest> {
  return {
    json: async () => body,
    headers: new Headers({
      'x-forwarded-for': `test-ip-${Math.random()}`, // IP unique pour éviter le rate limiting
    }),
  };
}

describe('Contact API', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_EMAIL;
    delete process.env.CONTACT_EMAIL_PASS;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('renvoie une erreur si les champs sont manquants', async () => {
    const mockReq = createMockRequest({});
    const res = await POST(mockReq as NextRequest);
    expect(res.status).toBe(400);
  });

  it('renvoie une erreur si le champ name est manquant', async () => {
    const mockReq = createMockRequest({ email: 'test@example.com', message: 'Test message avec au moins 10 caractères' });
    const res = await POST(mockReq as NextRequest);
    expect(res.status).toBe(400);
  });

  it('renvoie une erreur si le champ email est manquant', async () => {
    const mockReq = createMockRequest({ name: 'Test User', message: 'Test message avec au moins 10 caractères' });
    const res = await POST(mockReq as NextRequest);
    expect(res.status).toBe(400);
  });

  it('renvoie une erreur si le champ message est manquant', async () => {
    const mockReq = createMockRequest({ name: 'Test User', email: 'test@example.com' });
    const res = await POST(mockReq as NextRequest);
    expect(res.status).toBe(400);
  });

  it('renvoie un succès si tous les champs sont valides', async () => {
    // Forcer le chemin nodemailer (mocké) et éviter Resend
    process.env.CONTACT_EMAIL = 'contact@example.com';
    process.env.CONTACT_EMAIL_PASS = 'dummy-pass';
    delete process.env.RESEND_API_KEY;

    const mockReq = createMockRequest({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message avec au moins 10 caractères pour la validation'
    });
    const res = await POST(mockReq as NextRequest);
    expect(res.status).toBe(200);
  });

  it('renvoie une erreur serveur si l\'envoi d\'email échoue', async () => {
    // Mock nodemailer pour simuler une erreur
    (nodemailer.createTransport as jest.Mock).mockReturnValueOnce({
      sendMail: jest.fn().mockRejectedValue(new Error('SMTP Error')),
    });

    // Forcer le chemin nodemailer (mocké)
    process.env.CONTACT_EMAIL = 'contact@example.com';
    process.env.CONTACT_EMAIL_PASS = 'dummy-pass';
    delete process.env.RESEND_API_KEY;

    const mockReq = createMockRequest({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message avec au moins 10 caractères pour la validation'
    });
    const res = await POST(mockReq as NextRequest);
    expect(res.status).toBe(500);
  });
});
