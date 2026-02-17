import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Oranguru extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Sage\'s Riddle',
      cost: [C],
      damage: 0,
      text: 'Put a Pokémon from your hand face down in front of you. Your opponent guesses the type of that Pokémon, and then you reveal it. If your opponent guessed right, they draw 4 cards. If they guessed wrong, you draw 4 cards. Return the Pokémon to your hand.'
    },
    {
      name: 'Gentle Slap',
      cost: [C, C, C],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '182';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Oranguru';
  public fullName: string = 'Oranguru UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Sage's Riddle
    // TODO: Guessing mechanic (opponent guesses Pokemon type) not supported by engine.
    // Simplified: Player always draws 4 cards.
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 4);
    }

    return state;
  }
}
