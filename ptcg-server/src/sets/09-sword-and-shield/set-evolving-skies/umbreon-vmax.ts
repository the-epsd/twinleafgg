import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  StateUtils,
  PowerType,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED } from '../../../game/store/prefabs/prefabs';

export class UmbreonVMAX extends PokemonCard {
  protected _tags = [CardTag.POKEMON_VMAX, CardTag.SINGLE_STRIKE];

  public stage: Stage = Stage.VMAX;

  public regulationMark = 'E';

  public evolvesFrom = 'Umbreon V';

  public cardType: CardType[] = [CardType.DARK];

  public hp: number = 310;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Dark Signal',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'When you play this Pokémon from your hand to evolve 1 of ' +
        'your Pokémon during your turn, you may switch 1 of your ' +
        "opponent's Benched Pokémon with their Active Pokémon.",
    },
  ];

  public attacks = [
    {
      name: 'Max Darkness',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 160,
      text: '',
    },
  ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Umbreon VMAX';

  public fullName: string = 'Umbreon VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, (wantToUse) => {
        if (wantToUse) {
          GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
          );
        }
      });
    }
    return state;
  }
}
