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

export class HopsDubwool extends PokemonCard {
  protected _tags = [CardTag.HOPS];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = "Hop's Wooloo";

  public cardType: CardType[] = [C];

  public hp: number = 120;

  public weakness = [{ type: F }];

  public retreat = [C, C];

  public powers = [
    {
      name: 'Defiant Horn',
      powerType: PowerType.ABILITY,
      text: "When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may switch in 1 of your opponent's Benched Pokémon to the Active Spot.",
    },
  ];

  public attacks = [
    {
      name: 'Headbutt',
      cost: [C, C, C],
      damage: 80,
      text: '',
    },
  ];

  public regulationMark = 'I';

  public set: string = 'JTG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '136';

  public name: string = "Hop's Dubwool";

  public fullName: string = "Hop's Dubwool JTG";

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
