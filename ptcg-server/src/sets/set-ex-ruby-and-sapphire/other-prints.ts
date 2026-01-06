import { EnergySwitch } from '../set-scarlet-and-violet/energy-switch';
import { EnergyRemoval2 } from '../set-ex-power-keepers/energy-removal-2';
import { MetalEnergySpecial } from '../set-undaunted/metal-energy-special';
import { RainbowEnergy } from '../set-sun-and-moon/rainbow-energy';
import { Switch } from '../set-base-set/switch';

export class EnergySwitchRS extends EnergySwitch {
  public set = 'RS';
  public regulationMark = '';
  public setNumber = '82';
  public fullName = 'Energy Switch RS';
  public text = 'Move a basic Energy from 1 of your Pokémon to another of your Pokémon.';
}

export class EnergyRemoval2RS extends EnergyRemoval2 {
  public set = 'RS';
  public setNumber = '80';
  public fullName = 'Energy Removal 2 RS';
}

export class MetalEnergySpecialRS extends MetalEnergySpecial {
  public set = 'RS';
  public setNumber = '94';
  public fullName = 'Metal Energy RS';
  public text = 'Damage done by attacks to the Pokémon that Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). Ignore this effect if the Pokémon that Metal Energy is attached to isn\'t [M]. Metal Energy provides [M] Energy. (Doesn\'t count as a basic Energy card.)';
}

export class RainbowEnergyRS extends RainbowEnergy {
  public set = 'RS';
  public setNumber = '95';
  public fullName = 'Rainbow Energy RS';
  public text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) When you attach this card from your hand to 1 of your Pokémon, put 1 damage counter on that Pokémon.';
}

export class SwitchRS extends Switch {
  public set = 'RS';
  public setNumber = '92';
  public fullName = 'Switch RS';
  public text = 'Switch 1 of your Active Pokémon with 1 of your Benched Pokémon.';
}