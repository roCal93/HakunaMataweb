export const mockPush = jest.fn();
export const mockUsePathname = jest.fn();
export const mockUseRouter = jest.fn(() => ({ push: mockPush }));

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockUseRouter(),
}));
