const Club = require('../../src/models/Club');

jest.mock('../../src/models/Club', () => ({
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  getByCity: jest.fn(),
  getByManagerId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const clubController = require('../../src/controllers/clubController');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('clubController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Club.getAll.mockResolvedValue([[{ id: 1, name: 'Club Norte' }]]);
    Club.create.mockResolvedValue([{ insertId: 22 }]);
    Club.getById.mockResolvedValue([[{ id: 1, name: 'Club Norte' }]]);
    Club.getByCity.mockResolvedValue([[]]);
    Club.getByManagerId.mockResolvedValue([[]]);
    Club.update.mockResolvedValue([{ affectedRows: 1 }]);
    Club.delete.mockResolvedValue([{ affectedRows: 1 }]);
  });

  it('lists clubs', async () => {
    const res = createRes();

    await clubController.getAll({}, res, jest.fn());

    expect(Club.getAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Club Norte' }]);
  });

  it('creates a club successfully', async () => {
    const req = {
      user: { id: 'manager-1' },
      body: {
        name: 'Club Centro',
        address: 'Calle Mayor 1',
        city: 'Madrid',
        logo_url: '/logo.png',
        description: 'Club principal',
      },
    };
    const res = createRes();

    await clubController.create(req, res, jest.fn());

    expect(Club.create).toHaveBeenCalledWith({
      manager_id: 'manager-1',
      name: 'Club Centro',
      address: 'Calle Mayor 1',
      city: 'Madrid',
      logo_url: '/logo.png',
      description: 'Club principal',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Club created successfully', id: 22 });
  });

  it('returns 404 when the club does not exist', async () => {
    Club.getById.mockResolvedValueOnce([[]]);

    const res = createRes();
    await clubController.getById({ params: { id: '999' } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Club not found' });
  });

  it('forwards database errors when listing clubs', async () => {
    const error = new Error('database unavailable');
    Club.getAll.mockRejectedValueOnce(error);
    const next = jest.fn();

    await clubController.getAll({}, createRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('returns clubs by city and manager', async () => {
    Club.getByCity.mockResolvedValueOnce([[{ id: 2, city: 'Madrid' }]]);
    Club.getByManagerId.mockResolvedValueOnce([[{ id: 3, manager_id: 'manager-1' }]]);

    const cityRes = createRes();
    await clubController.getByCity({ params: { city: 'Madrid' } }, cityRes, jest.fn());
    expect(Club.getByCity).toHaveBeenCalledWith('Madrid');
    expect(cityRes.json).toHaveBeenCalledWith([{ id: 2, city: 'Madrid' }]);

    const managerRes = createRes();
    await clubController.getByManagerId({ params: { managerId: 'manager-1' } }, managerRes, jest.fn());
    expect(Club.getByManagerId).toHaveBeenCalledWith('manager-1');
    expect(managerRes.json).toHaveBeenCalledWith([{ id: 3, manager_id: 'manager-1' }]);
  });

  it('updates and deletes clubs', async () => {
    const updateRes = createRes();
    await clubController.update(
      {
        params: { id: '1' },
        body: {
          name: 'Club renovado',
          address: 'Calle Nueva 1',
          city: 'Valencia',
          logo_url: '/new-logo.png',
          description: 'Actualizado',
        },
      },
      updateRes,
      jest.fn(),
    );
    expect(updateRes.json).toHaveBeenCalledWith({ message: 'Club updated successfully' });

    const deleteRes = createRes();
    await clubController.delete({ params: { id: '1' } }, deleteRes, jest.fn());
    expect(deleteRes.json).toHaveBeenCalledWith({ message: 'Club deleted successfully' });
  });

  it('returns 404 for missing update and delete targets', async () => {
    Club.update.mockResolvedValueOnce([{ affectedRows: 0 }]);
    Club.delete.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const updateRes = createRes();
    await clubController.update(
      {
        params: { id: '999' },
        body: {
          name: 'Club renovado',
          address: 'Calle Nueva 1',
          city: 'Valencia',
          logo_url: '/new-logo.png',
          description: 'Actualizado',
        },
      },
      updateRes,
      jest.fn(),
    );
    expect(updateRes.status).toHaveBeenCalledWith(404);

    const deleteRes = createRes();
    await clubController.delete({ params: { id: '999' } }, deleteRes, jest.fn());
    expect(deleteRes.status).toHaveBeenCalledWith(404);
  });

  it('forwards validation-style failures from the data layer', async () => {
    const error = new Error('validation failed');
    Club.create.mockRejectedValueOnce(error);
    const next = jest.fn();

    await clubController.create(
      {
        user: { id: 'manager-1' },
        body: {
          name: '',
          address: 'Calle Mayor 1',
          city: 'Madrid',
        },
      },
      createRes(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
