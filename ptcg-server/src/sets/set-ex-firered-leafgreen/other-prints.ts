import { VsSeeker } from '../set-phantom-forces/vs-seeker';
import { Switch } from '../set-scarlet-and-violet/switch';

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