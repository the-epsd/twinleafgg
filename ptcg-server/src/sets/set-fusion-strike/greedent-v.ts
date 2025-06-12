import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class GreedentV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 210;
  public tags = [CardTag.POKEMON_V];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Body Slam',
      cost: [C, C],
      damage: 40,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Nom-Nom-Nom Incisors',
      cost: [C, C, C],
      damage: 120,
      text: 'Draw 3 cards.'
    },
    
  ];

  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '217';
  public name: string = 'Greedent V';
  public fullName: string = 'Greedent V FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Body Slam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      }));
    }

    // Nom-Nom-Nom Incisors
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 3);
    }

    return state;
  }
}