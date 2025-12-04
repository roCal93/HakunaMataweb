import type { Messages } from '@/lib/types';

export type Stage = 'initial' | 'stretching' | 'splitting' | 'split' | 'centering' | 'gathering';

export type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'callback';

export interface SplitContactButtonProps {
  onContactSelect?: (method: ContactMethod) => void;
  contactEmail?: string;
  contactPhone?: string;
  messages: Messages;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
  marketingConsent: boolean;
  // Honeypot field for spam bots (should stay empty)
  website: string;
}

export interface ButtonState {
  stage: Stage;
  showForm: boolean;
  selectedButton: number | null;
  isMobile: boolean;
  copiedMessage: boolean;
  formSuccess: boolean;
}

export interface ButtonStyles {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  scale: number;
  background: string;
  borderRadius?: string;
  boxShadow?: string;
}
