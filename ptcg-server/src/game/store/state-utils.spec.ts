import { CardType, SuperType } from './card/card-types';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { StateUtils } from './state-utils';

describe('StateUtils', () => {

  let fire: CardType[];
  let fighting: CardType[];
  let rainbow: CardType[];

  function createEnergy(name: string, provides: CardType[]): EnergyMap {
    const card = { name, superType: SuperType.ENERGY, provides, blendedEnergies: [] } as any;
    return { card, provides };
  }

  function createBlendEnergy(name: string, provides: CardType[], blendedEnergies: CardType[], blendedEnergyCount: number = 1): EnergyMap {
    const card = { name, superType: SuperType.ENERGY, provides, blendedEnergies, blendedEnergyCount } as any;
    return { card, provides };
  }

  beforeEach(() => {
    fire = [CardType.FIRE];
    fighting = [CardType.FIGHTING];
    rainbow = [CardType.ANY];
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

  it('Should return true when provided Unit Energy FDY for Fighting and Fairy cost', () => {
    // given
    const cost: CardType[] = [CardType.FIGHTING, CardType.FAIRY];
    const energy: EnergyMap[] = [
      createEnergy('fighting', fighting),
      createBlendEnergy('Unit Energy FDY', [CardType.COLORLESS], [CardType.FIGHTING, CardType.DARK, CardType.FAIRY])
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with multiple blends that match out of order energy cost', () => {
    // given
    const cost: CardType[] = [CardType.WATER, CardType.LIGHTNING];
    const energy: EnergyMap[] = [
      createBlendEnergy('Unit Energy LPM', [CardType.COLORLESS], [CardType.LIGHTNING, CardType.PSYCHIC, CardType.METAL]),
      createBlendEnergy('Blend Energy WLFM', [CardType.COLORLESS], [CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL]),
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with multiple blends and a rainbow that match out of order energy cost', () => {
    // given
    const cost: CardType[] = [CardType.WATER, CardType.LIGHTNING, CardType.GRASS];
    const energy: EnergyMap[] = [
      createBlendEnergy('Unit Energy LPM', [CardType.COLORLESS], [CardType.LIGHTNING, CardType.PSYCHIC, CardType.METAL]),
      createEnergy('rainbow', rainbow),
      createBlendEnergy('Blend Energy WLFM', [CardType.COLORLESS], [CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL]),
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
      createBlendEnergy('Unit Energy FDY', [CardType.COLORLESS], [CardType.FIGHTING, CardType.DARK, CardType.FAIRY])
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

  // Multi-energy blend tests (Team Rocket's Energy style)
  describe('Multi-energy blend cards', () => {
    it('Should return true when Team Rockets Energy provides PP for Psychic Psychic cost', () => {
      const cost: CardType[] = [CardType.PSYCHIC, CardType.PSYCHIC];
      const energy: EnergyMap[] = [
        createBlendEnergy('Team Rockets Energy', [CardType.COLORLESS, CardType.COLORLESS], [CardType.PSYCHIC, CardType.DARK], 2)
      ];

      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });

    it('Should return true when Team Rockets Energy provides DD for Dark Dark cost', () => {
      const cost: CardType[] = [CardType.DARK, CardType.DARK];
      const energy: EnergyMap[] = [
        createBlendEnergy('Team Rockets Energy', [CardType.COLORLESS, CardType.COLORLESS], [CardType.PSYCHIC, CardType.DARK], 2)
      ];

      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });

    it('Should return true when Team Rockets Energy provides PD for Psychic Dark cost', () => {
      const cost: CardType[] = [CardType.PSYCHIC, CardType.DARK];
      const energy: EnergyMap[] = [
        createBlendEnergy('Team Rockets Energy', [CardType.COLORLESS, CardType.COLORLESS], [CardType.PSYCHIC, CardType.DARK], 2)
      ];

      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });

    it('Should return true when Team Rockets Energy provides for PDC cost with another energy', () => {
      const cost: CardType[] = [CardType.PSYCHIC, CardType.DARK, CardType.COLORLESS];
      const energy: EnergyMap[] = [
        createBlendEnergy('Team Rockets Energy', [CardType.COLORLESS, CardType.COLORLESS], [CardType.PSYCHIC, CardType.DARK], 2),
        createEnergy('fire', fire)
      ];

      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });

    it('Should return false when Team Rockets Energy cannot satisfy Water cost', () => {
      const cost: CardType[] = [CardType.WATER, CardType.DARK];
      const energy: EnergyMap[] = [
        createBlendEnergy('Team Rockets Energy', [CardType.COLORLESS, CardType.COLORLESS], [CardType.PSYCHIC, CardType.DARK], 2)
      ];

      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
    });

    it('Should return true when Team Rockets Energy provides colorless for CC cost', () => {
      const cost: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
      const energy: EnergyMap[] = [
        createBlendEnergy('Team Rockets Energy', [CardType.COLORLESS, CardType.COLORLESS], [CardType.PSYCHIC, CardType.DARK], 2)
      ];

      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
  });

  describe('allEnergyProvidesIdentical', () => {
    const dark = [CardType.DARK];
    const fire = [CardType.FIRE];

    it('Should return true when all energy has same provides', () => {
      const energy: EnergyMap[] = [
        createEnergy('dark1', dark),
        createEnergy('dark2', dark),
        createEnergy('dark3', dark)
      ];
      expect(StateUtils.allEnergyProvidesIdentical(energy)).toBeTruthy();
    });

    it('Should return false when energy has different provides', () => {
      const energy: EnergyMap[] = [
        createEnergy('dark', dark),
        createEnergy('fire', fire)
      ];
      expect(StateUtils.allEnergyProvidesIdentical(energy)).toBeFalsy();
    });

    it('Should return true for single entry', () => {
      const energy: EnergyMap[] = [createEnergy('dark', dark)];
      expect(StateUtils.allEnergyProvidesIdentical(energy)).toBeTruthy();
    });

    it('Should return false for empty array', () => {
      expect(StateUtils.allEnergyProvidesIdentical([])).toBeFalsy();
    });
  });

  describe('selectMinimalEnergyForCost', () => {
    const dark = [CardType.DARK];
    const colorless2 = [CardType.COLORLESS, CardType.COLORLESS];

    it('Should return 1 entry when 3x dark for 1 colorless cost', () => {
      const energy: EnergyMap[] = [
        createEnergy('dark1', dark),
        createEnergy('dark2', dark),
        createEnergy('dark3', dark)
      ];
      const cost: CardType[] = [CardType.COLORLESS];
      const result = StateUtils.selectMinimalEnergyForCost(energy, cost);
      expect(result).not.toBeNull();
      expect(result!.length).toBe(1);
      expect(StateUtils.checkEnoughEnergy(result!, cost)).toBeTruthy();
    });

    it('Should return 1 entry when 2x DCE for 2 colorless cost', () => {
      const energy: EnergyMap[] = [
        createEnergy('dce1', colorless2),
        createEnergy('dce2', colorless2)
      ];
      const cost: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
      const result = StateUtils.selectMinimalEnergyForCost(energy, cost);
      expect(result).not.toBeNull();
      expect(result!.length).toBe(1);
      expect(StateUtils.checkEnoughEnergy(result!, cost)).toBeTruthy();
    });

    it('Should return null for insufficient energy', () => {
      const energy: EnergyMap[] = [createEnergy('dark', dark)];
      const cost: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
      const result = StateUtils.selectMinimalEnergyForCost(energy, cost);
      expect(result).toBeNull();
    });
  });
});