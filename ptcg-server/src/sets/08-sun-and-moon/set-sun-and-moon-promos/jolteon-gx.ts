import {
  CardTag,
  CardType,
  ChoosePokemonPrompt,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class JolteonGX extends PokemonCard {
  protected _tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType[] = [L];
  public hp: number = 200;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Electrobullet',
    cost: [L],
    damage: 30,
    text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Head Bolt',
    cost: [L, C],
    damage: 110,
    text: ''
  },
  {
    name: 'Swift Run-GX',
    cost: [L, C],
    damage: 110,
    text: 'Prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'SMP';
  public setNumber: string = '173';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jolteon-GX';
  public fullName: string = 'Jolteon-GX SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Electrobullet
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some((b) => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false },
        ),
        (targets) => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        },
      );
    }

    // Swift Run-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      BLOCK_IF_GX_ATTACK_USED(effect.player);
      effect.player.usedGX = true;
      PREVENT_DAMAGE(store, state, effect, this);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
    }

    return state;
  }
}
