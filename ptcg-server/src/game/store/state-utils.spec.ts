import { CardType, SuperType } from './card/card-types';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { StateUtils } from './state-utils';

describe('StateUtils', () => {

  let fire: CardType[];
  let fighting: CardType[];
  let rainbow: CardType[];

  function createEnergy(name: string, provides: CardType[]): EnergyMap {
    const card = { name, superType: SuperType.ENERGY, provides } as any;
    return { card, provides };
  }

  beforeEach(() => {
    fire = [CardType.FIRE];
    fighting = [CardType.FIGHTING];
    rainbow = [CardType.ANY];
  });

  it('Should return true, when provided the correct energy', () => {
    const cost: CardType[] = [CardType.FIRE];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire)
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return false when provided too few energy', () => {
    const cost: CardType[] = [CardType.FIRE, CardType.FIRE];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire)
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
  });

  it('Should return true when provided rainbow energy', () => {
    const cost: CardType[] = [CardType.FIRE, CardType.FIRE];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire),
      createEnergy('rainbow', rainbow)
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided Unit Energy FDY for Fighting and Fairy cost', () => {
    const cost: CardType[] = [CardType.FIGHTING, CardType.FAIRY];
    const energy: EnergyMap[] = [
      createEnergy('fighting', fighting),
      createEnergy('Unit Energy FDY', [CardType.FIGHTING, CardType.DARK, CardType.FAIRY])
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with multiple blends that match out of order energy cost', () => {
    const cost: CardType[] = [CardType.WATER, CardType.LIGHTNING];
    const energy: EnergyMap[] = [
      createEnergy('Unit Energy LPM', [CardType.LIGHTNING, CardType.PSYCHIC, CardType.METAL]),
      createEnergy('Blend Energy WLFM', [CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL]),
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with multiple blends and a rainbow that match out of order energy cost', () => {
    const cost: CardType[] = [CardType.WATER, CardType.LIGHTNING, CardType.GRASS];
    const energy: EnergyMap[] = [
      createEnergy('Unit Energy LPM', [CardType.LIGHTNING, CardType.PSYCHIC, CardType.METAL]),
      createEnergy('rainbow', rainbow),
      createEnergy('Blend Energy WLFM', [CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL]),
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with too much energy', () => {
    const cost: CardType[] = [CardType.FIGHTING, CardType.FIGHTING];
    const energy: EnergyMap[] = [
      createEnergy('fighting', fighting),
      createEnergy('fighting', fighting),
      createEnergy('Unit Energy FDY', [CardType.FIGHTING, CardType.DARK, CardType.FAIRY])
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should return true when provided with all rainbows', () => {
    const cost: CardType[] = [CardType.FIGHTING, CardType.FIGHTING];
    const energy: EnergyMap[] = [
      createEnergy('rainbow', rainbow),
      createEnergy('rainbow', rainbow),
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  describe('Choosable blend/unit provides', () => {
    const blendGrpd = [CardType.GRASS, CardType.FIRE, CardType.PSYCHIC, CardType.DARK];

    it('Should pay Psychic with Blend GRPD alone', () => {
      const cost: CardType[] = [CardType.PSYCHIC];
      const energy: EnergyMap[] = [createEnergy('Blend Energy GRPD', blendGrpd)];
      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });

    it('Should not pay Psychic + Colorless with Blend GRPD alone (Mind Bend)', () => {
      const cost: CardType[] = [CardType.PSYCHIC, CardType.COLORLESS];
      const energy: EnergyMap[] = [createEnergy('Blend Energy GRPD', blendGrpd)];
      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
    });

    it('Should pay Psychic + Colorless with Blend GRPD and a basic Colorless', () => {
      const cost: CardType[] = [CardType.PSYCHIC, CardType.COLORLESS];
      const energy: EnergyMap[] = [
        createEnergy('Blend Energy GRPD', blendGrpd),
        createEnergy('colorless', [CardType.COLORLESS]),
      ];
      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });

    it('Should treat Blend GRPD as providing Dark via includes', () => {
      const energy = createEnergy('Blend Energy GRPD', blendGrpd);
      expect(energy.provides.includes(CardType.DARK)).toBeTruthy();
      expect(StateUtils.isChoosableProvides(energy.provides)).toBeTruthy();
      expect(StateUtils.getProvidesUnitCount(energy.provides)).toBe(1);
    });

    it('Should not overcount blend as multiple typed energies', () => {
      const cost: CardType[] = [CardType.GRASS, CardType.FIRE];
      const energy: EnergyMap[] = [createEnergy('Blend Energy GRPD', blendGrpd)];
      expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
    });
  });

  // Multi-energy blend tests (Team Rocket's Energy style — two choosable entries)
  describe('Multi-energy blend cards', () => {
    const teamRocketUnit = [CardType.PSYCHIC, CardType.DARK];

    function createTeamRocketsEnergy(): EnergyMap[] {
      return [
        createEnergy("Team Rocket's Energy", teamRocketUnit),
        createEnergy("Team Rocket's Energy", teamRocketUnit),
      ];
    }

    it('Should return true when Team Rockets Energy provides PP for Psychic Psychic cost', () => {
      expect(StateUtils.checkEnoughEnergy(createTeamRocketsEnergy(), [CardType.PSYCHIC, CardType.PSYCHIC])).toBeTruthy();
    });

    it('Should return true when Team Rockets Energy provides DD for Dark Dark cost', () => {
      expect(StateUtils.checkEnoughEnergy(createTeamRocketsEnergy(), [CardType.DARK, CardType.DARK])).toBeTruthy();
    });

    it('Should return true when Team Rockets Energy provides PD for Psychic Dark cost', () => {
      expect(StateUtils.checkEnoughEnergy(createTeamRocketsEnergy(), [CardType.PSYCHIC, CardType.DARK])).toBeTruthy();
    });

    it('Should return true when Team Rockets Energy provides for PDC cost with another energy', () => {
      const energy: EnergyMap[] = [
        ...createTeamRocketsEnergy(),
        createEnergy('fire', fire)
      ];
      expect(StateUtils.checkEnoughEnergy(energy, [CardType.PSYCHIC, CardType.DARK, CardType.COLORLESS])).toBeTruthy();
    });

    it('Should return false when Team Rockets Energy cannot satisfy Water cost', () => {
      expect(StateUtils.checkEnoughEnergy(createTeamRocketsEnergy(), [CardType.WATER, CardType.DARK])).toBeFalsy();
    });

    it('Should return true when Team Rockets Energy provides colorless for CC cost', () => {
      expect(StateUtils.checkEnoughEnergy(createTeamRocketsEnergy(), [CardType.COLORLESS, CardType.COLORLESS])).toBeTruthy();
    });
  });

  describe('allEnergyProvidesIdentical', () => {
    const dark = [CardType.DARK];
    const fireTypes = [CardType.FIRE];

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
        createEnergy('fire', fireTypes)
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

    it('Should use one blend for one typed cost without over-applying', () => {
      const blend = [CardType.GRASS, CardType.FIRE, CardType.PSYCHIC, CardType.DARK];
      const energy: EnergyMap[] = [
        createEnergy('blend', blend),
        createEnergy('colorless', [CardType.COLORLESS]),
      ];
      const cost: CardType[] = [CardType.PSYCHIC, CardType.COLORLESS];
      const result = StateUtils.selectMinimalEnergyForCost(energy, cost);
      expect(result).not.toBeNull();
      expect(result!.length).toBe(2);
      expect(StateUtils.checkEnoughEnergy(result!, cost)).toBeTruthy();
    });
  });
});
