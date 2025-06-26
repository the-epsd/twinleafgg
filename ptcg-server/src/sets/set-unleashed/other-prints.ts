import { Judge } from "../set-scarlet-and-violet/judge";
import { SuperScoopUp } from "../set-diamond-and-pearl/super-scoop-up";

export class JudgeUL extends Judge {
  public fullName = 'Judge UL';
  public name = 'Judge';
  public set = 'UL';
  public setNumber = '78';
  public text = 'Each player shuffles his or her hand into his or her deck and draws 4 cards.';
}

export class SuperScoopUpUL extends SuperScoopUp {
  public fullName = 'Super Scoop Up UL';
  public name = 'Super Scoop Up';
  public set = 'UL';
  public setNumber = '83';
  public text = 'Flip a coin. If heads, return 1 of your Pokémon and all cards attached to it to your hand.';
}