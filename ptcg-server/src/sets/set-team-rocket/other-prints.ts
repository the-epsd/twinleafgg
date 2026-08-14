import { RainbowEnergy } from '../08-sun-and-moon/set-sun-and-moon/rainbow-energy';
import { DarkAlakazam } from './dark-alakazam';
import { DarkBlastoise } from './dark-blastoise';
import { DarkDragonite } from './dark-dragonite';
import { DarkVileplume } from './dark-vileplume';

export class RainbowEnergyTR extends RainbowEnergy {
  public set = 'TR';
  public setNumber = '17';
  public fullName = 'Rainbow Energy TR';
  public text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy counts as every type of basic Energy but only provides 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) When you attach this card from your hand to 1 of your Pokémon, it does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance.)';
}

export class DarkAlakazamTR18 extends DarkAlakazam {
  public setNumber = '18';
  public fullName = 'Dark Alakazam TR18';
  public set = 'TR';
}

export class DarkBlastoiseTR20 extends DarkBlastoise {
  public setNumber = '20';
  public fullName = 'Dark Blastoise TR20';
  public set = 'TR';
}

export class DarkDragoniteTR22 extends DarkDragonite {
  public setNumber = '22';
  public fullName = 'Dark Dragonite TR22';
  public set = 'TR';
}

export class DarkVileplumeTR30 extends DarkVileplume {
  public setNumber = '30';
  public fullName = 'Dark Vileplume TR30';
  public set = 'TR';
}
