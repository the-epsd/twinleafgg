import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import {
  CoinFlipPrompt,
  GameMessage,
  PlayerType,
  PowerType,
  SlotType,
  StateUtils,
  StoreLike,
  State,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Annihilape extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Primeape';
  public cardType: CardType = P;
  public hp: number = 150;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Durable Body',
      powerType: PowerType.ABILITY,
      text: 'If this Pokémon would be Knocked Out by damage from an attack, flip a coin. If heads, this Pokémon is not Knocked Out, and its remaining HP becomes 10.',
    },
  ];

  public attacks = [
    {
      name: 'Ghostly Blow',
      cost: [P, P],
      damage: 100,
      text: "Place 5 damage counters on 1 of your opponent's Benched Pokémon.",
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '41';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Annihilape';
  public fullName: string = 'Annihilape M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-ascended-heroes/mega-hawlucha-ex.ts (Tenacious Body)
    if (
      effect instanceof PutDamageEffect &&
      effect.target.cards.includes(this) &&
      effect.target.getPokemonCard() === this
    ) {
      const owner = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const checkHpEffect = new CheckHpEffect(owner, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.damage >= checkHpEffect.hp) {
        return store.prompt(
          state,
          new CoinFlipPrompt(owner.id, GameMessage.COIN_FLIP),
          (result) => {
            if (result === true) {
              effect.surviveOnTenHPReason = this.powers[0].name;
            }
            return state;
          },
        );
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.bench.some((b) => b.cards.length > 0)) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1 },
        ),
        (picked) => {
          if (!picked || picked.length === 0) {
            return;
          }
          const dest = picked[0];
          const putCounters = new PlaceDamageCountersEffect(player, dest, 50, this);
          store.reduceEffect(state, putCounters);
        },
      );
    }

    return state;
  }
}
