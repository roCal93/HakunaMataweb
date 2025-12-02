import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

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
  console.log('[CONTACT API] Requête reçue');
  
  // Rate limiting
  const rateKey = getRateLimitKey(req);
  if (rateKey && isRateLimited(rateKey)) {
    console.log('[CONTACT API] Rate limit atteint pour:', rateKey);
    return withCacheControl(NextResponse.json({ error: 'Trop de requêtes. Veuillez réessayer plus tard.' }, { status: 429 }));
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error('[CONTACT API] Erreur parsing JSON:', error);
    return withCacheControl(NextResponse.json({ error: 'Format de requête invalide' }, { status: 400 }));
  }

  const { name, email, message } = body;
  console.log('[CONTACT API] Données reçues:', { name, email: email?.substring(0, 5) + '...', messageLength: message?.length });
  
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
    console.log('[CONTACT API] Message invalide:', message?.length);
    return withCacheControl(NextResponse.json({ error: 'Message invalide (10-5000 caractères)' }, { status: 400 }));
  }

  // Sanitize les entrées pour le HTML
  const safeName = sanitizeHtml(name.trim());
  const safeEmail = sanitizeHtml(email.trim());
  const safeMessage = sanitizeHtml(message.trim());

  const emailSubject = `[Contact Hakuna Mataweb] Nouveau message de ${safeName}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hakunamataweb-production.up.railway.app';
  const logoUrl = `${siteUrl}/images/empreinte-patte.webp`;
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fffbeb; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="Hakuna Mataweb" style="width: 60px; height: 60px; margin-bottom: 10px;" />
        <h2 style="color: #d97706; margin: 0;">Nouveau message de contact</h2>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px solid #fde68a;">
        <p style="margin: 10px 0;"><strong style="color: #92400e;">Nom:</strong> ${safeName}</p>
        <p style="margin: 10px 0;"><strong style="color: #92400e;">Email:</strong> <a href="mailto:${safeEmail}" style="color: #d97706;">${safeEmail}</a></p>
        <hr style="border: none; border-top: 1px solid #fde68a; margin: 20px 0;" />
        <p style="margin: 10px 0;"><strong style="color: #92400e;">Message:</strong></p>
        <p style="white-space: pre-wrap; color: #292524; line-height: 1.6;">${safeMessage}</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #78716c;">
        <p>🐾 Hakuna Mataweb - Votre agence web sur mesure</p>
      </div>
    </div>
  `;
  const emailText = `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  try {
    // Utiliser Resend en production, Gmail en développement
    if (process.env.RESEND_API_KEY) {
      console.log('[CONTACT API] Utilisation de Resend...');
      
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // Utiliser le domaine de test de Resend ou le domaine personnalisé si configuré
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Hakuna Mataweb <onboarding@resend.dev>';
      const toEmail = process.env.CONTACT_EMAIL || 'romaincalmelet@gmail.com';
      
      console.log('[CONTACT API] Envoi depuis:', fromEmail, 'vers:', toEmail);
      
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: email,
        subject: emailSubject,
        html: emailHtml,
      });

      if (error) {
        console.error('[CONTACT API] Erreur Resend:', error);
        throw error;
      }

      console.log('[CONTACT API] Email envoyé avec succès via Resend!', data);
      return withCacheControl(NextResponse.json({ success: true }, { status: 200 }));
      
    } else if (process.env.CONTACT_EMAIL && process.env.CONTACT_EMAIL_PASS) {
      console.log('[CONTACT API] Utilisation de Gmail (nodemailer)...');
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.CONTACT_EMAIL,
          pass: process.env.CONTACT_EMAIL_PASS,
        },
      });
      
      await transporter.sendMail({
        from: process.env.CONTACT_EMAIL,
        replyTo: email,
        to: process.env.CONTACT_EMAIL,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
      
      console.log('[CONTACT API] Email envoyé avec succès via Gmail!');
      return withCacheControl(NextResponse.json({ success: true }, { status: 200 }));
      
    } else {
      console.error('[CONTACT API] Aucune configuration email trouvée!');
      console.error('[CONTACT API] RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'défini' : 'MANQUANT');
      console.error('[CONTACT API] CONTACT_EMAIL:', process.env.CONTACT_EMAIL ? 'défini' : 'MANQUANT');
      console.error('[CONTACT API] CONTACT_EMAIL_PASS:', process.env.CONTACT_EMAIL_PASS ? 'défini' : 'MANQUANT');
      return withCacheControl(NextResponse.json({ 
        error: 'Configuration email manquante. Veuillez configurer RESEND_API_KEY ou CONTACT_EMAIL/CONTACT_EMAIL_PASS.' 
      }, { status: 500 }));
    }
  } catch (error) {
    // Toujours logger les erreurs en production pour débugger
    console.error('[CONTACT API] Erreur lors de l\'envoi:', error);
    
    // Détails de l'erreur
    if (error instanceof Error) {
      console.error('[CONTACT API] Message d\'erreur:', error.message);
      console.error('[CONTACT API] Stack:', error.stack);
    }
    
    return withCacheControl(NextResponse.json({ 
      error: "Erreur lors de l'envoi du mail. Veuillez réessayer ou nous contacter directement.",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 }));
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
