import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

Object.defineProperty(global, 'TextEncoder', {
  configurable: true,
  value: TextEncoder,
  writable: true,
});

Object.defineProperty(global, 'TextDecoder', {
  configurable: true,
  value: TextDecoder,
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    addEventListener: jest.fn(),
    addListener: jest.fn(),
    dispatchEvent: jest.fn(),
    media: query,
    matches: false,
    onchange: null,
    removeEventListener: jest.fn(),
    removeListener: jest.fn(),
  })),
});

Object.defineProperty(window.URL, 'createObjectURL', {
  configurable: true,
  value: jest.fn(() => 'blob:mock-preview'),
  writable: true,
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  configurable: true,
  value: jest.fn(),
  writable: true,
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { changeLanguage: jest.fn(), language: 'es' },
    t: (key: string) => key,
  }),
}));
