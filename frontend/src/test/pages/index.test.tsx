import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'es' },
    t: (key: string) => key,
  }),
}));

describe('Home page', () => {
  it('renders the main landing content', () => {
    const { asFragment } = render(<Home />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'home.title' })).toBeVisible();
    expect(screen.getByPlaceholderText('home.searchbar')).toBeVisible();
    expect(screen.getByRole('link', { name: 'home.signup_button' })).toHaveAttribute('href', '/register');
    expect(screen.getByRole('link', { name: 'home.explore_button' })).toHaveAttribute('href', '/clubs');
    expect(screen.getByText('home.reviews_title')).toBeVisible();
    expect(asFragment()).toMatchSnapshot();
  });
});