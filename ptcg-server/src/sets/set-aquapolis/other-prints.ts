import { MetalEnergySpecial } from "../set-undaunted/metal-energy-special";
import { PokemonFanClub } from "../set-pop-series-4/pokemon-fan-club";
import { RainbowEnergy } from "../set-sun-and-moon/rainbow-energy";
import { WarpEnergy } from "../set-shining-legends/warp-energy";

export class MetalEnergySpecialAQ extends MetalEnergySpecial {
  public fullName = 'Metal Energy AQ';
  public set = 'AQ';
  public setNumber = '143';
  public text = 'Damage done to the Pokémon Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). If the Pokémon Metal Energy is attached to isn\'t [M], whenever it damages a Pokémon, reduce that damage by 10 (before applying Weakness and Resistance). Metal Energy provides [M] Energy. (Doesn\'t count as a basic Energy card.)';
}

export class PokemonFanClubAQ extends PokemonFanClub {
  public fullName = 'Pokemon Fan Club AQ';
  public set = 'AQ';
  public setNumber = '130';
  public text = 'Search your deck for up to 2 Baby Pokémon and/or Basic Pokémon cards and put them onto your Bench. Shuffle your deck afterward.';
}

export class RainbowEnergyAQ extends RainbowEnergy {
  public fullName = 'Rainbow Energy AQ';
  public set = 'AQ';
  public setNumber = '144';
  public text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) When you attach this card from your hand to 1 of your Pokémon, put 1 damage counter on that Pokémon.';
}

export class WarpEnergyAQ extends WarpEnergy {
  public fullName = 'Warp Energy AQ';
  public set = 'AQ';
  public setNumber = '147';
  public text = 'Warp Energy provides 1 [C] Energy.\n\nWhen you attach Warp Energy from your hand to your Active Pokémon, switch your Active Pokémon with 1 of your Benched Pokémon.';
}