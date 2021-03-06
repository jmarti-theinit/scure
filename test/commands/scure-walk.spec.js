const { scureWalk } = require('../../src/commands/scure-walk');
const { scureInitializeState } = require('../../src/commands/scure-initializer');
const { aRoom } = require('../../src/dsl');


describe('Ric Escape - when walking', () => {
  let data = null;
  let prevScureData = null;
  let scure;

  beforeEach(() => {
    scure = buildTestScure();
    data = scureInitializeState(scure, {});
    prevScureData = scure.data;
  });

  afterEach(() => {
    scure.data = prevScureData;
  });

  it('changes the roomId when walking', () => {
    const destination = 'comedor';
    data.roomId = 'pasillo-norte';

    const response = scureWalk(destination, data, scure);

    expect(response.data.roomId).to.equal('comedor');
    expect(response.sentence).to.contains('Estoy en el comedor de la nave espacial. Puedo ver mesas, sillas, comida varia y varios utensilios que no entiendo para qué funcionan. También veo algo en el suelo.');
  });

  it('cannot change the roomId when walking to somewhere not according to map', () => {
    const destination = 'biblioteca';
    data.roomId = 'sala-mandos';

    const response = scureWalk(destination, data, scure);

    expect(response.data.roomId).to.equal('sala-mandos');
    expect(response.sentence).to.contains('No sé ir al sitio biblioteca.');
    expect(response.sentence).to.contains('Desde aquí puedo ir a: Pasillo norte');
  });

  const TEST_DATA = [
    { room: 'pasillo-norte', destinations: 'Desde aquí puedo ir a: Sala de mandos, Comedor y Pasillo central' },
    { room: 'sala-mandos', destinations: 'Desde aquí puedo ir a: Pasillo norte' },
    { room: 'habitacion-110', destinations: 'No podemos ir a ningún sitio' },
  ];

  TEST_DATA.forEach((testData) => {
    it('explains places to go when no arg is given', () => {
      const destination = null;
      data.roomId = testData.room;

      const response = scureWalk(destination, data, scure);

      expect(response.data.roomId).to.equal(testData.room);
      expect(response.sentence).to.contains(`${testData.destinations}`);
    });
  });

  it('does not change if the room cannot be found', () => {
    const destination = 'pasillo de la muerte';
    data.roomId = 'sala-mandos';

    const response = scureWalk(destination, data, scure);

    expect(response.data.roomId).to.equal('sala-mandos');
    expect(response.sentence).to.contains('No sé ir al sitio pasillo de la muerte.');
  });

  describe('handles locks', () => {
    it('does not show a room if not unlocked', () => {
      const destination = null;
      data.roomId = 'pasillo-sur';

      const response = scureWalk(destination, data, scure);

      expect(response.sentence).to.contains('Desde aquí puedo ir a: Pasillo central');
    });

    it('shows a room if unlocked', () => {
      const destination = null;
      data.roomId = 'pasillo-sur';
      data.unlocked = ['hab108'];

      const response = scureWalk(destination, data, scure);

      expect(response.sentence).to.contains('Desde aquí puedo ir a: Habitación 108 y Pasillo central');
    });

    it('does not change if the room is locked', () => {
      const destination = 'habitación 108';
      data.roomId = 'pasillo-sur';

      const response = scureWalk(destination, data, scure);

      expect(response.data.roomId).to.equal('pasillo-sur');
      expect(response.sentence).to.contains('No sé ir al sitio habitación 108.');
    });

    it('responds something else if lock destination has a sentence when locked', () => {
      const destination = 'habitación 109';
      data.roomId = 'pasillo-sur';

      const response = scureWalk(destination, data, scure);

      expect(response.data.roomId).to.equal('pasillo-sur');
      expect(response.sentence).to.contains('La habitación 109 está fregada y no puedes acceder hasta que se seque.');
    });
    it('changes room when room is unlocked', () => {
      const destination = 'habitación 108';
      data.roomId = 'pasillo-sur';
      data.unlocked = ['hab108'];

      const response = scureWalk(destination, data, scure);

      expect(response.data.roomId).to.equal('habitacion-108');
      expect(response.sentence).to.contains(scure.rooms.getRoom('habitacion-108').description);
    });
  });
  it('works with unaccented words', () => {
    const destination = 'habitacion 108';
    data.roomId = 'pasillo-sur';
    data.unlocked = ['hab108'];

    const response = scureWalk(destination, data, scure);

    expect(response.data.roomId).to.equal('habitacion-108');
  });

  it('works when room name destination is the same as the place im staying', () => {
    scure.data.rooms.push(aRoom('habitacion-111', 'habitacion 111', ['otra habitación'], 'Una super hab'));
    scure.data.map['habitacion-111'] = ['habitacion-109'];
    scure.data.map['habitacion-109'] = ['habitacion-111'];
    scure.data.rooms.find(r => r.id === 'habitacion-109').synonyms = ['otra habitación'];
    data.roomId = 'habitacion-109';

    const response = scureWalk('otra habitación', data, scure);

    expect(response.data.roomId).to.equal('habitacion-111');
  });

  describe('when init.canJumpRooms is true', () => {
    beforeEach(() => {
      scure = buildTestScure();
      scure.data.init.canJumpRooms = true;
    });

    it('can change room even if they are not in the map', () => {
      data.roomId = 'sala-mandos';
      const destination = 'biblioteca';

      const response = scureWalk(destination, data, scure);

      expect(response.data.roomId).to.equal('biblioteca');
      expect(response.sentence).to.contains('Estoy en la biblioteca');
    });

    it('cannot jump to a locked room', () => {
      data.roomId = 'sala-mandos';
      const destination = 'habitación 108';

      const response = scureWalk(destination, data, scure);

      expect(response.data.roomId).to.equal('sala-mandos');
      expect(response.sentence).to.contains('No sé ir al sitio habitación 108');
    });
  });
});
