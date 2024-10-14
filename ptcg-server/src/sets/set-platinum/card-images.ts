import { CrobatG } from './crobat-g';
import { PokeTurn } from './poke-turn';
import { PokemonRescue } from './pokemon-rescue';

export class CrobatGArt extends CrobatG {
  public cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/crobat-g-platinum-pl-47.jpg?fit=600%2C825&ssl=1';
}

export class PokeTurnArt extends PokeTurn {
  public cardImage = 'https://images.pokemontcg.io/pl1/118_hires.png';
}

export class PokemonRescueArt extends PokemonRescue {
  public cardImage = 'https://images.pokemontcg.io/pl1/115_hires.png';
}