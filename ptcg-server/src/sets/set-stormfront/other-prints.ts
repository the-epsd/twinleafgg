import { EnergySwitchPK } from '../set-ex-power-keepers/other-prints';
import { GreatBall } from '../set-ex-firered-leafgreen/great-ball';
import { Potion } from '../set-base-set/potion';
import { Switch } from '../set-base-set/switch';
import { Charmander } from '../set-base-set/charmander';
import { Charmeleon } from '../set-base-set/charmeleon';
import { Charizard } from '../set-base-set/charizard';
import { CycloneEnergy } from '../set-ex-power-keepers/cyclone-energy';
import { PremierBall } from '../set-great-encounters/premier-ball';
import { WarpEnergy } from '../set-shining-legends/warp-energy';

export class CycloneEnergySF extends CycloneEnergy {
  public fullName = 'Cyclone Energy (SF 94)';
  public legacyFullName = 'Cyclone Energy SF';
  public name = 'Cyclone Energy';
  public set = 'SF';
  public setNumber = '94';
  public text = 'Cyclone Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. Your opponent chooses the Benched Pokémon to switch.';
}

export class PremierBallSF extends PremierBall {
  public fullName = 'Premier Ball (SF 91)';
  public legacyFullName = 'Premier Ball SF';
  public name = 'Premier Ball';
  public set = 'SF';
  public setNumber = '91';
}

export class WarpEnergySF extends WarpEnergy {
  public fullName = 'Warp Energy (SF 95)';
  public legacyFullName = 'Warp Energy SF';
  public name = 'Warp Energy';
  public set = 'SF';
  public setNumber = '95';
  public text = 'Warp Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.';
}
export class EnergySwitchPKSF extends EnergySwitchPK {
  public setNumber = '84';
  public fullName: string = 'Energy Switch (SF 84)';
  public legacyFullName = 'Energy Switch SF';
  public set = 'SF';
}

export class GreatBallSF extends GreatBall {
  public setNumber = '85';
  public fullName: string = 'Great Ball (SF 85)';
  public legacyFullName = 'Great Ball SF';
  public set = 'SF';
}

export class PotionSF extends Potion {
  public setNumber = '92';
  public fullName: string = 'Potion (SF 92)';
  public legacyFullName = 'Potion SF';
  public set = 'SF';
}

export class SwitchSF extends Switch {
  public setNumber = '93';
  public fullName: string = 'Switch (SF 93)';
  public legacyFullName = 'Switch SF';
  public set = 'SF';
}

export class CharmanderSF extends Charmander {
  public setNumber = '101';
  public fullName: string = 'Charmander (SF 101)';
  public legacyFullName = 'Charmander SF';
  public set = 'SF';
}

export class CharmeleonSF extends Charmeleon {
  public setNumber = '102';
  public fullName: string = 'Charmeleon (SF 102)';
  public legacyFullName = 'Charmeleon SF';
  public set = 'SF';
}

export class CharizardSF extends Charizard {
  public setNumber = '103';
  public fullName: string = 'Charizard (SF 103)';
  public legacyFullName = 'Charizard SF';
  public set = 'SF';
}
