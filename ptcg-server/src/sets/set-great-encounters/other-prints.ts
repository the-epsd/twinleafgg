import { Leftovers } from '../set-pokemon-151/leftovers';
import { RareCandy } from '../set-ex-holon-phantoms/rare-candy';

export class RareCandyGE extends RareCandy {
  public fullName = 'Rare Candy GE';
  public name = 'Rare Candy';
  public set = 'GE';
  public setNumber = '102';
  public text = 'Choose 1 of your Basic Pokémon in play. If you have a Stage 1 or Stage 2 card that evolves from that Pokémon in your hand, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.)';
}
export class LeftoversGE extends Leftovers {
  public setNumber = '99';
  public fullName: string = 'Leftovers GE';
  public set = 'GE';
}
