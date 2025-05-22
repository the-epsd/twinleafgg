import { EscapeRope } from "../set-battle-styles/escape-rope";
import { DualBall } from "../set-unleashed/dual-ball";

export class WarpPointMA extends EscapeRope {
  public set = 'MA';
  public setNumber = '85';
  public name = 'Warp Point';
  public fullName = 'Warp Point MA';
  public text = 'Your opponent switches 1 of his or her Defending Pokémon with 1 of his or her Benched Pokémon, if any. You switch 1 of your Active Pokémon with 1 of your Benched Pokémon, if any.'
}

export class DualBallMA extends DualBall {
  public set = 'MA';
  public setNumber = '72';
  public fullName = 'Dual Ball MA';
  public text = 'Flip 2 coins. For each heads, search your deck for a Basic Pokémon card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
}