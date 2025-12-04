// Types partagés pour l'application Hakuna Mataweb

export interface HomeMessages {
  title: string;
  subtitle: string;
}

export interface AboutMessages {
  heading: string;
  paragraph: string;
}

export interface ExploreMessages {
  heading: string;
  paragraph: string;
}

export interface ButtonsMessages {
  demo: string;
  explore_demo: string;
  see_creations: string;
  contact: string;
}

export interface CreationsMessages {
  heading: string;
  paragraph: string;
}

export interface CardMessages {
  title: string;
  description: string;
}

export interface CardsMessages {
  vitrine: CardMessages;
  chalet: CardMessages;
  artisan: CardMessages;
}

export interface ContactMessages {
  heading: string;
  paragraph: string;
}

export interface FooterMessages {
  brand: string;
  description: string;
  contact: string;
  rights: string;
}

export interface NavMessages {
  about: string;
  explore: string;
  creations: string;
  contact: string;
  quickLinks: string;
  privacy: string;
  legalNotice: string;
}

export interface HeroItemMessages {
  label: string;
  ctaLabel: string;
  ctaDescription: string;
}

export interface HeroMessages {
  explorer: HeroItemMessages;
  about: HeroItemMessages;
  contact: HeroItemMessages;
  creations: HeroItemMessages;
}

export interface AboutCardItemMessages {
  alt: string;
  text: string;
}

export interface AboutCardsMessages {
  innovation: AboutCardItemMessages;
  solutions: AboutCardItemMessages;
  identity: AboutCardItemMessages;
}

export interface ContactFormValidationMessages {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormErrorMessages {
  network: string;
  send: string;
}

export interface ContactFormMessages {
  title: string;
  name: string;
  email: string;
  message: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  cancel: string;
  send: string;
  success: string;
  copied: string;
  validation: ContactFormValidationMessages;
  error: ContactFormErrorMessages;
  // Optional fields for legal/consent UI
  consentLabel?: string;
  privacyNotice?: string;
  privacyLinkText?: string;
}

export interface ContactButtonMessages {
  initial: string;
  email: string;
  phone: string;
  whatsapp: string;
  callback: string;
  close: string;
  form: ContactFormMessages;
}

export interface AriaMessages {
  languageSwitcher: string;
  linkedin: string;
  github: string;
  chooseContact: string;
  callbackForm: string;
  contactForm: string;
  closeForm: string;
  fullName: string;
  emailAddress: string;
  optionalMessage: string;
  cancelCloseForm: string;
  sendForm: string;
  closeContactMenu: string;
  scrollDownAbout: string;
  footerText: string;
  pawPrint: string;
  currentLanguage: string;
  switchToFrench: string;
  switchToEnglish: string;
}

export interface Messages {
  home: HomeMessages;
  about: AboutMessages;
  explore: ExploreMessages;
  buttons: ButtonsMessages;
  creations: CreationsMessages;
  cards: CardsMessages;
  contact: ContactMessages;
  footer: FooterMessages;
  nav: NavMessages;
  hero: HeroMessages;
  aboutCards: AboutCardsMessages;
  contactButton: ContactButtonMessages;
  aria: AriaMessages;
}
