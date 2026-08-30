import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  AFTER_ATTACK,
  SWITCH_ACTIVE_WITH_BENCHED,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class DarkAlakazam extends PokemonCard {
  protected _tags = [CardTag.DARK];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dark Kadabra';
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Teleport Blast',
      cost: [P, P, C],
      damage: 30,
      text: 'You may switch Dark Alakazam with 1 of your Benched Pokémon. (Do the damage before switching the Pokémon.)',
    },
    {
      name: 'Mind Shock',
      cost: [P, P, P],
      damage: 40,
      text: "Don't apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)",
    },
  ];

  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Dark Alakazam';
  public fullName: string = 'Dark Alakazam TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Teleport Blast
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      state = store.prompt(
        state,
        new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_SWITCH_POKEMON),
        (wantToUse) => {
          if (wantToUse) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        },
      );
    }
    // Mind Shock
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }

    return state;
  }
}
