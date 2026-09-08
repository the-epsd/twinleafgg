import { CardType, PokemonCard,
  ChoosePokemonPrompt,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StoreLike,
  CardTag,
  Stage, } from '../../../game';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { StateUtils } from '../../../game/store/state-utils';
import { THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class MedichamV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_V];
  public cardType: CardType[] = [F];
  public hp = 210;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Yoga Loop',
      cost: [C, C],
      damage: 0,
      text: "Put 2 damage counters on 1 of your opponent's Pokémon. If your opponent's Pokémon is Knocked Out by this attack, take another turn after this one. (Skip Pokémon Checkup.) If 1 of your Pokémon used Yoga Loop during your last turn, this attack can't be used.",
    },
    {
      name: 'Smash Uppercut',
      cost: [F, C, C],
      damage: 100,
      text: "This attack's damage isn't affected by Resistance.",
    },
  ];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Medicham V';
  public fullName: string = 'Medicham V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Always arm the "can't use Yoga Loop next turn" lock (Radiant Charizard pattern).
      THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(player, this.attacks[0]);

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          const targets = selected || [];
          if (targets.length === 0) {
            return state;
          }

          const target = targets[0];
          const putCountersEffect = new PutCountersEffect(effect, 20);
          putCountersEffect.target = target;
          state = store.reduceEffect(state, putCountersEffect);

          // Check if target was knocked out
          const targetOwner = StateUtils.findOwner(state, target);
          const checkHpEffect = new CheckHpEffect(targetOwner, target);
          store.reduceEffect(state, checkHpEffect);

          if (target.damage >= checkHpEffect.hp) {
            // Ref: usedTurnSkip + usedTurnSkipClearArmed (game-phase-effect)
            player.usedTurnSkip = true;
          }

          return state;
        },
      );
    }
    return state;
  }
}
