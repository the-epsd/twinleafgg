import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Cloyster extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shellder';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Withdraw',
    cost: [],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Cloyster by attacks during your opponent\'s next turn.'
  },
  {
    name: 'Spine Missile',
    cost: [W, C],
    damage: 0,
    text: 'Flip 4 coins. For each heads, choose an opponent\'s Pokémon in play and this attack does 20 damage to those Pokémon. (You may choose the same Pokémon more than once.) (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Cloyster';
  public fullName: string = 'Cloyster SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Withdraw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    // Spine Missile
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
        const heads = results.filter(r => r).length;
        if (heads === 0) {
          return;
        }

        const dealHits = (remaining: number) => {
          if (remaining <= 0) {
            return;
          }
          const hasTargets = opponent.active.cards.length > 0 || opponent.bench.some(b => b.cards.length > 0);
          if (!hasTargets) {
            return;
          }
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            const target = selected && selected[0];
            if (target) {
              const damageEffect = new PutDamageEffect(effect, 20);
              damageEffect.target = target;
              store.reduceEffect(state, damageEffect);
            }
            dealHits(remaining - 1);
          });
        };
        dealHits(heads);
      });
    }

    return state;
  }
}
