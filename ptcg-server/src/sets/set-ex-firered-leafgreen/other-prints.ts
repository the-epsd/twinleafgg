import { EnergyRemoval2 } from '../set-ex-power-keepers/energy-removal-2';
import { MultiEnergy } from '../set-ex-sandstorm/multi-energy';
import { PokemonReversal } from '../set-ex-unseen-forces/pokemon-reversal';
import { ProfessorOaksResearch } from '../set-ex-dragon-frontiers/professor-oaks-research';
import { VsSeeker } from '../set-phantom-forces/vs-seeker';
import { Switch } from '../set-scarlet-and-violet/switch';

export class EnergyRemoval2RG extends EnergyRemoval2 {
  public fullName = 'Energy Removal 2 RG';
  public set = 'RG';
  public setNumber = '89';
}

export class MultiEnergyRG extends MultiEnergy {
  public fullName = 'Multi Energy RG';
  public set = 'RG';
  public setNumber = '103';
}

export class PokemonReversalRG extends PokemonReversal {
  public fullName = 'Pokémon Reversal RG';
  public set = 'RG';
  public setNumber = '97';
  public text = 'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.';
}

export class ProfOaksResearchRG extends ProfessorOaksResearch {
  public fullName = 'Prof. Oak\'s Research RG';
  public name = 'Prof. Oak\'s Research';
  public set = 'RG';
  public setNumber = '98';
}

export class VsSeekerRG extends VsSeeker {
  public fullName = 'VS Seeker RG';
  public set = 'RG';
  public setNumber = '100';
  public text = 'Search your discard pile for a Supporter card, show it to your opponent, and put it into your hand.';
}

export class SwitchRG extends Switch {
  public fullName = 'Switch RG';
  public set = 'RG';
  public setNumber = '102';
  public text = 'Switch your Active Pokémon with 1 of your Benched Pokémon.';
}