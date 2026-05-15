import { render, screen } from '@testing-library/react';
import CourtFormModal from '../CourtFormModal';
import { getApiUrl } from '@/utils/runtimeConfig';
import type { Club } from '@/types/club';
import type { Court } from '@/types/court';
import { useAppDispatch } from '@/store/hooks';
import { uploadCourtImage } from '@/api/courtApi';

jest.mock('@/store/hooks', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('@/api/courtApi', () => ({
  uploadCourtImage: jest.fn(),
}));

jest.mock('@/utils/runtimeConfig', () => ({
  getApiUrl: jest.fn(() => 'http://localhost:5000'),
}));

const mockDispatch = jest.fn();
const mockOnClose = jest.fn();

const clubs: Club[] = [
  {
    id: 11,
    manager_id: 'manager-1',
    name: 'Club Norte',
    address: 'Calle Mayor 1',
    city: 'Madrid',
    logo_url: '/logo.png',
    description: 'Club principal',
  },
];

const court: Court = {
  id: 4,
  club_id: 11,
  name: 'Pista central',
  surface_type: 'dura',
  sport: 'padel',
  price_60: 24,
  price_90: 32,
  price_120: 40,
  min_unit_min: 60,
  image_url: '/uploads/courts/pista-central.jpg',
  description: 'Pista cubierta para competiciones',
  is_indoor: true,
};

describe('CourtFormModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <CourtFormModal isOpen={false} onClose={mockOnClose} clubs={clubs} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the court data and matches the snapshot when open', () => {
    const { asFragment } = render(
      <CourtFormModal
        isOpen
        onClose={mockOnClose}
        court={court}
        clubs={clubs}
      />,
    );

    expect(screen.getByText('courts.form_edit_title')).toBeInTheDocument();
    expect(screen.getByLabelText('courts.form_name')).toHaveValue('Pista central');
    expect(screen.queryByLabelText('courts.form_club')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Pista central')).toBeVisible();
    expect(screen.getByAltText('court-preview')).toHaveAttribute(
      'src',
      'http://localhost:5000/uploads/courts/pista-central.jpg',
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
