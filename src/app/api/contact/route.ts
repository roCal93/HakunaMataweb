import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Rate limiting simple en mémoire (pour production, utilisez Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 requêtes
const RATE_LIMIT_WINDOW = 60 * 1000; // par minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

function hashString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

function getRateLimitKey(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0]?.trim();
    if (ip) {
      return ip;
    }
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const ua = req.headers.get('user-agent');
  if (ua) {
    return `ua:${hashString(ua)}`;
  }

  return null;
}

// Validation email côté serveur
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Sanitization basique pour éviter XSS dans les emails HTML
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const rateKey = getRateLimitKey(req);
  if (rateKey && isRateLimited(rateKey)) {
    return withCacheControl(NextResponse.json({ error: 'Trop de requêtes. Veuillez réessayer plus tard.' }, { status: 429 }));
  }

  const { name, email, message } = await req.json();
  
  // Validation des champs
  if (!name || !email || !message) {
    return withCacheControl(NextResponse.json({ error: 'Champs manquants' }, { status: 400 }));
  }

  // Validation du nom (min 2 caractères, max 100)
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return withCacheControl(NextResponse.json({ error: 'Nom invalide' }, { status: 400 }));
  }

  // Validation de l'email
  if (typeof email !== 'string' || !isValidEmail(email)) {
    return withCacheControl(NextResponse.json({ error: 'Email invalide' }, { status: 400 }));
  }

  // Validation du message (min 10 caractères, max 5000)
  if (typeof message !== 'string' || message.trim().length < 10 || message.length > 5000) {
    return withCacheControl(NextResponse.json({ error: 'Message invalide (10-5000 caractères)' }, { status: 400 }));
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
  });

  // Sanitize les entrées pour le HTML
  const safeName = sanitizeHtml(name.trim());
  const safeEmail = sanitizeHtml(email.trim());
  const safeMessage = sanitizeHtml(message.trim());

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_EMAIL, // Toujours envoyer depuis notre propre email
      replyTo: email, // L'email de l'utilisateur en reply-to
      to: process.env.CONTACT_EMAIL,
      subject: `[Contact Hakuna Mataweb] Nouveau message de ${safeName}`,
      text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <hr style="border: 1px solid #fde68a;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `
    });
    return withCacheControl(NextResponse.json({ success: true }, { status: 200 }));
  } catch (error) {
    // Log error in production without exposing details
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur envoi email:', error);
    }
    return withCacheControl(NextResponse.json({ error: "Erreur lors de l'envoi du mail" }, { status: 500 }));
  }
}

type NextResponseLike = NextResponse & {
  headers?: {
    set?: (key: string, value: string) => void;
  };
};

function withCacheControl(response: NextResponseLike) {
  if (response?.headers && typeof response.headers.set === 'function') {
    response.headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
  }
  return response;
}
