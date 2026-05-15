const Court = require('../../src/models/Court');

jest.mock('../../src/models/Court', () => ({
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  getByClubId: jest.fn(),
  getByCity: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const courtController = require('../../src/controllers/courtController');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('courtController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Court.getAll.mockResolvedValue([[{ id: 1, name: 'Pista central' }]]);
    Court.create.mockResolvedValue([{ insertId: 31 }]);
    Court.getById.mockResolvedValue([[{ id: 1, name: 'Pista central' }]]);
    Court.getByClubId.mockResolvedValue([[]]);
    Court.getByCity.mockResolvedValue([[]]);
    Court.update.mockResolvedValue([{ affectedRows: 1 }]);
    Court.delete.mockResolvedValue([{ affectedRows: 1 }]);
  });

  it('lists courts with filters', async () => {
    const res = createRes();

    await courtController.getAll({ query: { sport: 'padel', is_indoor: 'true' } }, res, jest.fn());

    expect(Court.getAll).toHaveBeenCalledWith({ sport: 'padel', is_indoor: true });
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Pista central' }]);
  });

  it('creates a court successfully', async () => {
    const req = {
      body: {
        club_id: 11,
        name: 'Pista central',
        surface_type: 'dura',
        sport: 'padel',
        price_60: 24,
        price_90: 32,
        price_120: 40,
        min_unit_min: 60,
        image_url: '/court.png',
        description: 'Cubierta',
        is_indoor: true,
      },
    };
    const res = createRes();

    await courtController.create(req, res, jest.fn());

    expect(Court.create).toHaveBeenCalledWith({
      club_id: 11,
      name: 'Pista central',
      surface_type: 'dura',
      sport: 'padel',
      price_60: 24,
      price_90: 32,
      price_120: 40,
      min_unit_min: 60,
      image_url: '/court.png',
      description: 'Cubierta',
      is_indoor: true,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Court created successfully', id: 31 });
  });

  it('returns 404 when the court does not exist', async () => {
    Court.getById.mockResolvedValueOnce([[]]);

    const res = createRes();
    await courtController.getById({ params: { id: '999' } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Court not found' });
  });

  it('returns 404 when updating a missing court', async () => {
    Court.update.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = createRes();
    await courtController.update(
      {
        params: { id: '999' },
        body: {
          name: 'Pista nueva',
          surface_type: 'dura',
          sport: 'padel',
          price_60: 24,
          price_90: 32,
          price_120: 40,
          min_unit_min: 60,
          image_url: '/court.png',
          description: 'Cubierta',
          is_indoor: true,
        },
      },
      res,
      jest.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Court not found' });
  });

  it('forwards database errors', async () => {
    const error = new Error('database unavailable');
    Court.getAll.mockRejectedValueOnce(error);
    const next = jest.fn();

    await courtController.getAll({ query: {} }, createRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('returns courts by club and city', async () => {
    Court.getByClubId.mockResolvedValueOnce([[{ id: 2, club_id: 11 }]]);
    Court.getByCity.mockResolvedValueOnce([[{ id: 3, city: 'Madrid' }]]);

    const clubRes = createRes();
    await courtController.getByClubId({ params: { clubId: '11' } }, clubRes, jest.fn());
    expect(Court.getByClubId).toHaveBeenCalledWith('11');
    expect(clubRes.json).toHaveBeenCalledWith([{ id: 2, club_id: 11 }]);

    const cityRes = createRes();
    await courtController.getByCity({ params: { city: 'Madrid' } }, cityRes, jest.fn());
    expect(Court.getByCity).toHaveBeenCalledWith('Madrid');
    expect(cityRes.json).toHaveBeenCalledWith([{ id: 3, city: 'Madrid' }]);
  });

  it('updates and deletes courts', async () => {
    const updateRes = createRes();
    await courtController.update(
      {
        params: { id: '1' },
        body: {
          name: 'Pista renovada',
          surface_type: 'dura',
          sport: 'padel',
          price_60: 30,
          price_90: 40,
          price_120: 50,
          min_unit_min: 60,
          image_url: '/new-court.png',
          description: 'Actualizada',
          is_indoor: false,
        },
      },
      updateRes,
      jest.fn(),
    );
    expect(updateRes.json).toHaveBeenCalledWith({ message: 'Court updated successfully' });

    const deleteRes = createRes();
    await courtController.delete({ params: { id: '1' } }, deleteRes, jest.fn());
    expect(deleteRes.json).toHaveBeenCalledWith({ message: 'Court deleted successfully' });
  });

  it('returns 404 for missing update and delete targets', async () => {
    Court.update.mockResolvedValueOnce([{ affectedRows: 0 }]);
    Court.delete.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const updateRes = createRes();
    await courtController.update(
      {
        params: { id: '999' },
        body: {
          name: 'Pista renovada',
          surface_type: 'dura',
          sport: 'padel',
          price_60: 30,
          price_90: 40,
          price_120: 50,
          min_unit_min: 60,
          image_url: '/new-court.png',
          description: 'Actualizada',
          is_indoor: false,
        },
      },
      updateRes,
      jest.fn(),
    );
    expect(updateRes.status).toHaveBeenCalledWith(404);

    const deleteRes = createRes();
    await courtController.delete({ params: { id: '999' } }, deleteRes, jest.fn());
    expect(deleteRes.status).toHaveBeenCalledWith(404);
  });

  it('forwards validation-style failures from the data layer', async () => {
    const error = new Error('validation failed');
    Court.create.mockRejectedValueOnce(error);
    const next = jest.fn();

    await courtController.create(
      {
        body: {
          club_id: 11,
          name: '',
          surface_type: 'invalid-surface',
          sport: 'padel',
          price_60: 24,
          price_90: 32,
          price_120: 40,
        },
      },
      createRes(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
