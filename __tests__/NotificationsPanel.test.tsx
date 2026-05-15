import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NotificationsPanel from '@/components/NotificationsPanel';

const now = new Date().toISOString();
const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
const oneDayAgo = new Date(Date.now() - 86_400_000).toISOString();
const fiveMinAgo = new Date(Date.now() - 300_000).toISOString();

describe('NotificationsPanel', () => {
  it('shows empty state when there are no notifications', () => {
    render(<NotificationsPanel notifications={[]} onClose={jest.fn()} />);
    expect(screen.getByText('No hay notificaciones')).toBeInTheDocument();
  });

  it('renders a notification message', () => {
    render(
      <NotificationsPanel
        notifications={[
          { id: 1, message: 'Recibiste $100', createdAt: now, read: false },
        ]}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText('Recibiste $100')).toBeInTheDocument();
  });

  it('formats timestamps: Ahora for < 1 min', () => {
    render(
      <NotificationsPanel
        notifications={[
          { id: 1, message: 'Ahora mismo', createdAt: now, read: false },
        ]}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText('Ahora')).toBeInTheDocument();
  });

  it('formats timestamps: Hace Xm for < 1 hour', () => {
    render(
      <NotificationsPanel
        notifications={[
          {
            id: 1,
            message: 'Hace minutos',
            createdAt: fiveMinAgo,
            read: false,
          },
        ]}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText(/Hace \d+m/)).toBeInTheDocument();
  });

  it('formats timestamps: Hace Xh for < 1 day', () => {
    render(
      <NotificationsPanel
        notifications={[
          { id: 1, message: 'Hace horas', createdAt: oneHourAgo, read: true },
        ]}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText(/Hace \d+h/)).toBeInTheDocument();
  });

  it('formats timestamps: Hace Xd for older notifications', () => {
    render(
      <NotificationsPanel
        notifications={[
          { id: 1, message: 'Hace dias', createdAt: oneDayAgo, read: true },
        ]}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText(/Hace \d+d/)).toBeInTheDocument();
  });
});
