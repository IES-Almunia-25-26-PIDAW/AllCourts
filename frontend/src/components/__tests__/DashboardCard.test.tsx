import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardCard from '../DashboardCard';

describe('DashboardCard', () => {
  it('renders the visible props and matches the snapshot', () => {
    const { asFragment } = render(
      <DashboardCard
        title="Pistas disponibles"
        value={12}
        icon="📊"
        subtitle="Actualizado hace 5 minutos"
      />,
    );

    expect(screen.getByText('Pistas disponibles')).toBeVisible();
    expect(screen.getByText('12')).toBeVisible();
    expect(screen.getByText('📊')).toHaveAttribute('aria-hidden');
    expect(screen.getByText('Actualizado hace 5 minutos')).toBeVisible();
    expect(asFragment()).toMatchSnapshot();
  });

  it('bubbles click interactions from the card content', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <div onClick={onClick}>
        <DashboardCard title="Reservas" value={8} subtitle="Hoy" />
      </div>,
    );

    await user.click(screen.getByText('Reservas'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
