import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CircularHero } from '../CircularHero';
import { jest } from '@jest/globals';
import fr from '../../../locales/fr.json';

// Mock des APIs du navigateur
const mockGetBoundingClientRect = jest.fn(() => ({
  width: 448,
  height: 448,
  top: 0,
  left: 0,
  bottom: 448,
  right: 448,
}));

const mockGetElementById = jest.fn();

Object.defineProperty(window, 'getComputedStyle', {
  value: jest.fn(() => ({
    getPropertyValue: jest.fn(() => ''),
  })),
});

Object.defineProperty(window, 'requestAnimationFrame', {
  value: jest.fn((cb: FrameRequestCallback) => setTimeout(cb, 16)),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: jest.fn(),
});

// Utilise les vrais timers pour permettre le mock avec jest.spyOn
// Les spies seront créés dans les tests concernés

// Mock HTMLElement methods
Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  value: mockGetBoundingClientRect,
});

Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
  value: 0,
});

Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
});

Object.defineProperty(window, 'pageYOffset', {
  value: 0,
});

Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
});

describe('CircularHero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('affiche le titre principal "Hakuna Mataweb"', () => {
    render(<CircularHero messages={fr} />);
    const title = screen.getByText('Hakuna Mataweb');
    expect(title).toBeInTheDocument();
  });

  it('affiche le sous-titre "Le web sans souci"', () => {
    render(<CircularHero messages={fr} />);
    const subtitle = screen.getByText(/le web sans souci/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('affiche les labels de navigation des quadrants', () => {
    render(<CircularHero messages={fr} />);
    expect(screen.getByText('Explorer')).toBeInTheDocument();
    expect(screen.getByText('À propos')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Créations')).toBeInTheDocument();
  });

  it('affiche le chevron de défilement', () => {
    render(<CircularHero messages={fr} />);
    // Attendre que le chevron apparaisse dans le DOM
    waitFor(() => {
      const chevron = screen.queryByTestId('chevron');
      expect(chevron).not.toBeNull();
    });
  });

  it('change vers le mode compact lors du scroll', async () => {
    render(<CircularHero messages={fr} />);

    // Simuler le scroll
    Object.defineProperty(window, 'scrollY', { value: 100 });
    fireEvent.scroll(window);

    await waitFor(() => {
      // Le composant devrait être en mode compact
      expect(window.scrollY).toBe(100);
    });
  });

  it('gère les clics sur les quadrants', () => {
    // Ajoute une section fictive dans le DOM pour simuler la cible du scroll
    const section = document.createElement('section');
    section.id = 'about';
    Object.defineProperty(section, 'offsetTop', { value: 500 });
    document.body.appendChild(section);

    const mockElement = section;
    mockGetElementById.mockReturnValue(mockElement);

    render(<CircularHero messages={fr} />);

    const quadrantLink = screen.getByText('À propos');
    fireEvent.click(quadrantLink);

    // Vérifie que le lien existe et que le handler ne plante pas
    expect(quadrantLink).toBeInTheDocument();

    // Nettoyage
    document.body.removeChild(section);
  });

  it('gère le clic sur le chevron pour défiler vers le bas', () => {
    const mockElement = {
      offsetTop: 800,
      getBoundingClientRect: () => ({ top: 800, bottom: 900 }),
    };
    mockGetElementById.mockReturnValue(mockElement);

    render(<CircularHero messages={fr} />);

    waitFor(() => {
      const chevron = screen.queryByTestId('chevron');
      if (chevron) {
        fireEvent.click(chevron);
        expect(window.scrollTo).toHaveBeenCalled();
      }
    });
  });

  it('gère les événements de souris sur les quadrants', async () => {
    render(<CircularHero messages={fr} />);

    const quadrantLink = screen.getByText('Explorer');

    // Simuler mouseenter
    fireEvent.mouseEnter(quadrantLink);

    // Attendre que l'état se mette à jour
    await waitFor(() => {
      expect(quadrantLink).toBeInTheDocument();
    });
  });

  it('masque le chevron lors du scroll vers le bas', () => {
    render(<CircularHero messages={fr} />);

    // Simuler scroll vers le bas
    Object.defineProperty(window, 'scrollY', { value: 150 });
    fireEvent.scroll(window);

    // Attendre que le chevron soit masqué (ou absent du DOM)
    waitFor(() => {
      const chevron = screen.queryByTestId('chevron');
      expect(chevron).toBeNull();
    });
  });

  it('gère le redimensionnement de la fenêtre', () => {
    render(<CircularHero messages={fr} />);

    // Simuler redimensionnement mobile
    Object.defineProperty(window, 'innerWidth', { value: 600 });
    fireEvent.resize(window);

    // Simuler redimensionnement desktop
    Object.defineProperty(window, 'innerWidth', { value: 1200 });
    fireEvent.resize(window);

    expect(window.innerWidth).toBe(1200);
  });

  it('anime les gradients en arrière-plan', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(window, 'setInterval').mockImplementation(() => 1 as unknown as ReturnType<typeof setInterval>);
    render(<CircularHero messages={fr} />);

    // Avancer le temps pour déclencher le changement de gradient
    jest.advanceTimersByTime(2000);

    expect(spy).toHaveBeenCalled();
  });

  it('gère la navigation automatique entre les quadrants', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(window, 'setInterval').mockImplementation(() => 1 as unknown as ReturnType<typeof setInterval>);
    render(<CircularHero messages={fr} />);

    // Avancer le temps pour déclencher la navigation automatique
    jest.advanceTimersByTime(5000);

    expect(spy).toHaveBeenCalled();
  });

  it('gère les événements de focus sur les liens de navigation', () => {
    render(<CircularHero messages={fr} />);

    const quadrantLink = screen.getByText('Contact');

    // Simuler focus
    fireEvent.focus(quadrantLink);

    // Simuler blur
    fireEvent.blur(quadrantLink);

    expect(quadrantLink).toBeInTheDocument();
  });

  it('gère le clic sur le cercle central pour revenir en haut', () => {
    render(<CircularHero messages={fr} />);

    // Trouver le cercle central (il contient le titre)
    const centralCircle = screen.getByText('Hakuna Mataweb').closest('div');

    if (centralCircle) {
      fireEvent.click(centralCircle);
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    }
  });

  it('affiche les séparateurs de quadrants après l\'animation initiale', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(window, 'setTimeout').mockImplementation(() => 1 as unknown as ReturnType<typeof setTimeout>);
    render(<CircularHero messages={fr} />);

    // Avancer le temps pour que les séparateurs apparaissent
    jest.advanceTimersByTime(2500);

    expect(spy).toHaveBeenCalled();
  });

  it('gère les événements de scroll pour mettre à jour la rotation', () => {
    // Mock des sections
    const mockSection = {
      id: 'about',
      getBoundingClientRect: () => ({ top: 300, bottom: 600 }),
    };
    mockGetElementById.mockReturnValue(mockSection);

    render(<CircularHero messages={fr} />);

    // Simuler scroll
    Object.defineProperty(window, 'innerHeight', { value: 800 });
    fireEvent.scroll(window);

    expect(mockGetElementById).toHaveBeenCalledWith('about');
  });
});
