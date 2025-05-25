import { RainbowEnergy } from "../set-sun-and-moon/rainbow-energy";
import { MetalEnergySpecial } from "../set-undaunted/metal-energy-special";

export class RainbowEnergyRS extends RainbowEnergy {
  public set = 'RS';
  public setNumber = '95';
  public fullName = 'Rainbow Energy RS';
  public text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) When you attach this card from your hand to 1 of your Pokémon, put 1 damage counter on that Pokémon.';
}

export class MetalEnergySpecialRS extends MetalEnergySpecial {
  public set = 'RS';
  public setNumber = '94';
  public fullName = 'Metal Energy RS';
  public text = 'Damage done by attacks to the Pokémon that Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). Ignore this effect if the Pokémon that Metal Energy is attached to isn\'t [M]. Metal Energy provides [M] Energy. (Doesn\'t count as a basic Energy card.)';
}