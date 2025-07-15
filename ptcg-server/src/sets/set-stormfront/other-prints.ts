import { CycloneEnergy } from "../set-ex-power-keepers/cyclone-energy";
import { PremierBall } from "../set-great-encounters/premier-ball";
import { WarpEnergy } from "../set-shining-legends/warp-energy";

export class CycloneEnergySF extends CycloneEnergy {
  public fullName = 'Cyclone Energy SF';
  public name = 'Cyclone Energy';
  public set = 'SF';
  public setNumber = '94';
  public text = 'Cyclone Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. Your opponent chooses the Benched Pokémon to switch.';
}

export class PremierBallSF extends PremierBall {
  public fullName = 'Premier Ball SF';
  public name = 'Premier Ball';
  public set = 'SF';
  public setNumber = '91';
}

export class WarpEnergySF extends WarpEnergy {
  public fullName = 'Warp Energy SF';
  public name = 'Warp Energy';
  public set = 'SF';
  public setNumber = '95';
  public text = 'Warp Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.';
}