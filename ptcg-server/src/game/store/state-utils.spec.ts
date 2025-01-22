import { CardType, SuperType } from './card/card-types';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { StateUtils } from './state-utils';

describe('StateUtils', () => {

  // let playerId: number;
  let fire: CardType[];
  let fighting: CardType[];
  let lightning: CardType[];
  let water: CardType[];
  let unitFdy: CardType[];
  let blendWLFM: CardType[];
  let unitLPM: CardType[];
  let unitGRW: CardType[];
  let rainbow: CardType[];
  let blendGRPD: CardType[];
  // let dark: CardType[];
  // let colorless: CardType[];
  // let dce: CardType[];

  function createEnergy(name: string, provides: CardType[]): EnergyMap {
    const card = { name, superType: SuperType.ENERGY, provides } as any;
    return { card, provides };
  }

  beforeEach(() => {
    // playerId = 1;
    fire = [CardType.FIRE];
    fighting = [CardType.FIGHTING];
    lightning = [CardType.LIGHTNING];
    water = [CardType.WATER];
    unitFdy = [CardType.FDY];
    blendWLFM = [CardType.WLFM];
    unitLPM = [CardType.LPM];
    unitGRW = [CardType.GRW];
    rainbow = [CardType.ANY];
    blendGRPD = [CardType.GRPD];
    // dce = [ CardType.COLORLESS, CardType.COLORLESS ];
  });

  it('Should return true, when provided the correct energy', () => {
    // given
    const cost: CardType[] = [CardType.FIRE];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return false when provided too few energy', () => {
    // given
    const cost: CardType[] = [CardType.FIRE, CardType.FIRE];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
  });

  it('Should return true when provided rainbow energy', () => {
    // given
    const cost: CardType[] = [CardType.FIRE, CardType.FIRE];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire),
      createEnergy('rainbow', rainbow)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided fdy', () => {
    // given
    const cost: CardType[] = [CardType.FIGHTING, CardType.FAIRY];
    const energy: EnergyMap[] = [
      createEnergy('fighting', fighting),
      createEnergy('unitFdy', unitFdy)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with multiple blends that match out of order energy cost', () => {
    // given
    const cost: CardType[] = [CardType.WATER, CardType.LIGHTNING];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendWLFM', blendWLFM),
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with multiple blends and a rainbow that match out of order energy cost', () => {
    // given
    const cost: CardType[] = [CardType.WATER, CardType.LIGHTNING, CardType.GRASS];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('rainbow', rainbow),
      createEnergy('blendWLFM', blendWLFM),
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with too much energy', () => {
    // given
    const cost: CardType[] = [CardType.FIGHTING, CardType.FIGHTING];
    const energy: EnergyMap[] = [
      createEnergy('fighting', fighting),
      createEnergy('fighting', fighting),
      createEnergy('unitFdy', unitFdy)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with all rainbows', () => {
    // given
    const cost: CardType[] = [CardType.FIGHTING, CardType.FIGHTING];
    const energy: EnergyMap[] = [
      createEnergy('rainbow', rainbow),
      createEnergy('rainbow', rainbow),
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle two Unit LPM for {L}{L} cost', () => {
    // given
    const cost: CardType[] = [CardType.LIGHTNING, CardType.LIGHTNING];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM1', unitLPM),
      createEnergy('unitLPM2', unitLPM)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle two Unit GRW for {R}{R} cost', () => {
    // given
    const cost: CardType[] = [CardType.FIRE, CardType.FIRE];
    const energy: EnergyMap[] = [
      createEnergy('unitGRW1', unitGRW),
      createEnergy('unitGRW2', unitGRW)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle different multi-energies for same type cost', () => {
    // given
    const cost: CardType[] = [CardType.FIRE, CardType.FIRE];
    const energy: EnergyMap[] = [
      createEnergy('unitGRW', unitGRW),
      createEnergy('blendGRPD', blendGRPD)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle Unit LPM + Blend WLFM for {L}{M} cost', () => {
    // given
    const cost: CardType[] = [CardType.LIGHTNING, CardType.METAL];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendWLFM', blendWLFM)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle Unit GRW + Blend GRPD for {R}{W} cost', () => {
    // given
    const cost: CardType[] = [CardType.FIRE, CardType.WATER];
    const energy: EnergyMap[] = [
      createEnergy('unitGRW', unitGRW),
      createEnergy('blendGRPD', blendGRPD)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle two different Blend energies for {L}{P} cost', () => {
    // given
    const cost: CardType[] = [CardType.LIGHTNING, CardType.PSYCHIC];
    const energy: EnergyMap[] = [
      createEnergy('blendWLFM', blendWLFM),
      createEnergy('blendGRPD', blendGRPD)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle same Blend energy twice for {W}{F} cost', () => {
    // given
    const cost: CardType[] = [CardType.WATER, CardType.FIGHTING];
    const energy: EnergyMap[] = [
      createEnergy('blendWLFM1', blendWLFM),
      createEnergy('blendWLFM2', blendWLFM)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should fail when one multi-energy provides a cost but not the other', () => {
    // given
    const cost: CardType[] = [CardType.PSYCHIC, CardType.PSYCHIC];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendWLFM', blendWLFM)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
  });

  it('Should handle complex mix of basic and multi-energies', () => {
    // given
    const cost: CardType[] = [
      CardType.LIGHTNING,
      CardType.PSYCHIC,
      CardType.WATER,
      CardType.COLORLESS
    ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendWLFM', blendWLFM),
      createEnergy('lightning', lightning),
      createEnergy('water', water)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle ANY type from rainbow with multi-energies', () => {
    const cost: CardType[] = [
      CardType.LIGHTNING,
      CardType.PSYCHIC,
      CardType.WATER
    ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('rainbow', rainbow),
      createEnergy('blendWLFM', blendWLFM)
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle energy assignment regardless of energy card order', () => {
    // given
    const cost: CardType[] = [CardType.FIRE, CardType.PSYCHIC];

    const energy1: EnergyMap[] = [
      createEnergy('blendGRPD', blendGRPD),
      createEnergy('unitLPM', unitLPM)
    ];

    const energy2: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendGRPD', blendGRPD)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy1, cost)).toBeTruthy();
    expect(StateUtils.checkEnoughEnergy(energy2, cost)).toBeTruthy();
  });
});