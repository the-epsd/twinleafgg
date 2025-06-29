import { PokemonReversal } from '../set-ex-unseen-forces/pokemon-reversal';
import { VsSeeker } from '../set-phantom-forces/vs-seeker';
import { Switch } from '../set-scarlet-and-violet/switch';

export class PokemonReversalRG extends PokemonReversal {
  public fullName = 'Pokémon Reversal RG';
  public set = 'RG';
  public setNumber = '97';
  public text = 'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.';
}

export class VsSeekerFL extends VsSeeker {
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