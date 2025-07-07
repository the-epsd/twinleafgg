import { DoubleColorlessEnergy } from "../set-base-set/double-colorless-energy";
import { Fisherman } from "../set-celestial-storm/fisherman";
import { Pokegear30 } from "../set-scarlet-and-violet/pokegear-30";
import { PokemonCommunication } from "../set-team-up/pokemon-communication";
import { PokemonReversal } from "../set-ex-unseen-forces/pokemon-reversal";
import { RainbowEnergy } from "../set-sun-and-moon/rainbow-energy";
import { Switch } from "../set-scarlet-and-violet/switch";


export class DoubleColorlessEnergyHS extends DoubleColorlessEnergy {
  public fullName = 'Double Colorless Energy HS';
  public set = 'HS';
  public setNumber = '103';
  public text = 'Double Colorless Energy provides [C][C] Energy.';
}

export class FishermanHS extends Fisherman {
  public fullName = 'Fisherman HS';
  public name = 'Fisherman';
  public set = 'HS';
  public setNumber = '92';
  public text = 'Search your discard pile for 4 basic Energy cards, show them to your opponent, and put them into your hand.';
}

export class Pokegear30HS extends Pokegear30 {
  public fullName = 'Pokégear 3.0 HS';
  public name = 'Pokégear 3.0';
  public set = 'HS';
  public setNumber = '96';
  public text = 'Look at the top 7 cards of your deck. Choose a Supporter card you find there, show it to your opponent, and put it into your hand. Shuffle the other cards back into your deck.';
}

export class PokemonCommunicationHS extends PokemonCommunication {
  public fullName = 'Pokemon Communication HS';
  public name = 'Pokemon Communication';
  public set = 'HS';
  public setNumber = '98';
  public text = 'Choose 1 Pokémon in your hand, show it to your opponent, and put it on top of your deck. If you do, search your deck for a Pokémon, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
}

export class PokemonReversalHS extends PokemonReversal {
  public fullName = 'Pokemon Reversal HS';
  public name = 'Pokemon Reversal';
  public set = 'HS';
  public setNumber = '99';
  public text = 'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with your opponent\'s Active Pokémon.'
}

export class RainbowEnergyHS extends RainbowEnergy {
  public fullName = 'Rainbow Energy HS';
  public set = 'HS';
  public setNumber = '104';
  public text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Has no effect other than providing Energy.) When you attach this card from your hand to 1 of your Pokémon, put 1 damage counter on that Pokémon. (While not in play, Rainbow Energy counts as [C] Energy.)';
}

export class SwitchHS extends Switch {
  public fullName = 'Switch HS';
  public name = 'Switch';
  public set = 'HS';
  public setNumber = '102';
  public text = 'Switch 1 of your Active Pokémon with 1 of your Benched Pokémon.';
}