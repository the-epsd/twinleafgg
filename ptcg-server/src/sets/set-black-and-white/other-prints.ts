import { EnergySearch } from '../set-fossil/energy-search';
import { EnergySwitchPK } from '../set-ex-power-keepers/other-prints';
import { FullHeal } from '../set-base-set/full-heal';
import { PokeBall } from '../set-jungle/pokeball';
import { PokemonCommunicationHS } from '../set-heartgold-and-soulsilver/other-prints';
import { Potion } from '../set-base-set/potion';
import { SuperScoopUp } from '../set-diamond-and-pearl/super-scoop-up';
import { Reshiram as ReshiramBLW26 } from '../set-black-and-white/reshiram';
import { Zekrom as ZekromBLW47 } from '../set-black-and-white/zekrom';
import { EnergyRetrieval } from '../set-scarlet-and-violet/energy-retrieval';
import { Switch } from '../set-scarlet-and-violet/switch';

export class EnergyRetrievalBLW extends EnergyRetrieval {
  public set: string = 'BLW';
  public setNumber: string = '92';
  public regulationMark = '';
  public name: string = 'Energy Retrieval';
  public fullName: string = 'Energy Retrieval BLW';
}

export class SwitchBLW extends Switch {
  public set: string = 'BLW';
  public setNumber: string = '104';
  public regulationMark = '';
  public name: string = 'Switch';
  public fullName: string = 'Switch BLW';
}
export class EnergySearchBLW extends EnergySearch {
  public setNumber = '93';
  public fullName: string = 'Energy Search BLW';
  public set = 'BLW';
}

export class EnergySwitchPKBLW extends EnergySwitchPK {
  public setNumber = '94';
  public fullName: string = 'Energy Switch BLW';
  public set = 'BLW';
}

export class FullHealBLW extends FullHeal {
  public setNumber = '95';
  public fullName: string = 'Full Heal BLW';
  public set = 'BLW';
}

export class PokeBallBLW extends PokeBall {
  public setNumber = '97';
  public fullName: string = 'Poké Ball BLW';
  public set = 'BLW';
}

export class PokemonCommunicationHSBLW extends PokemonCommunicationHS {
  public setNumber = '99';
  public fullName: string = 'Pokemon Communication BLW';
  public set = 'BLW';
}

export class PotionBLW extends Potion {
  public setNumber = '100';
  public fullName: string = 'Potion BLW';
  public set = 'BLW';
}

export class SuperScoopUpBLW extends SuperScoopUp {
  public setNumber = '103';
  public fullName: string = 'Super Scoop Up BLW';
  public set = 'BLW';
}

export class Reshiram2BLW extends ReshiramBLW26 {
  public setNumber = '113';
  public fullName: string = 'Reshiram2 BLW';
  public set = 'BLW';
}

export class Zekrom2BLW extends ZekromBLW47 {
  public setNumber = '114';
  public fullName: string = 'Zekrom2 BLW';
  public set = 'BLW';
}
