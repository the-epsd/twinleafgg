import { CardType, SuperType } from './card/card-types';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { StateUtils } from './state-utils';

describe('StateUtils', () => {

  // let playerId: number;
  let fire: CardType[];
  let fighting: CardType[];
  let unitFdy: CardType[];
  let blendWLFM: CardType[];
  let unitLPM: CardType[];
  // let dark: CardType[];
  // let colorless: CardType[];
  let rainbow: CardType[];
  // let dce: CardType[];

  function createEnergy(name: string, provides: CardType[]): EnergyMap {
    const card = { name, superType: SuperType.ENERGY, provides } as any;
    return { card, provides };
  }

  beforeEach(() => {
    // playerId = 1;
    fire = [ CardType.FIRE ];
    fighting = [ CardType.FIGHTING ];
    // dark = [ CardType.DARK ];
    unitFdy = [ CardType.FDY ];
    blendWLFM = [ CardType.WLFM ];
    unitLPM = [ CardType.LPM ];
    // colorless = [ CardType.COLORLESS ];
    rainbow = [ CardType.ANY ];
    // dce = [ CardType.COLORLESS, CardType.COLORLESS ];
  });

  it('Should return true, when provided the correct energy', () => {
    // given
    const cost: CardType[] = [ CardType.FIRE ];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return false when provided too few energy', () => {
    // given
    const cost: CardType[] = [ CardType.FIRE, CardType.FIRE ];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
  });
  
  it('Should return true when provided rainbow energy', () => {
    // given
    const cost: CardType[] = [ CardType.FIRE, CardType.FIRE ];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire),
      createEnergy('rainbow', rainbow)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return true when provided fdy', () => {
    // given
    const cost: CardType[] = [ CardType.FIGHTING, CardType.FAIRY ];
    const energy: EnergyMap[] = [
      createEnergy('fighting', fighting),
      createEnergy('unitFdy', unitFdy)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return true when provided with multiple blends that match out of order energy cost', () => {
    // given
    const cost: CardType[] = [ CardType.WATER, CardType.LIGHTNING ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendWLFM', blendWLFM),
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return true when provided with multiple blends and a rainbow that match out of order energy cost', () => {
    // given
    const cost: CardType[] = [ CardType.WATER, CardType.LIGHTNING, CardType.GRASS ];
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
    const cost: CardType[] = [ CardType.FIGHTING, CardType.FIGHTING ];
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
    const cost: CardType[] = [ CardType.FIGHTING, CardType.FIGHTING ];
    const energy: EnergyMap[] = [
      createEnergy('rainbow', rainbow),
      createEnergy('rainbow', rainbow),
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
});
