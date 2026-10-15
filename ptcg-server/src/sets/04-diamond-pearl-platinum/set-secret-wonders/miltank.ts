import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS } from '../../../game/store/prefabs/attack-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';

export class Miltank extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Healing Milk',
    cost: [],
    damage: 0,
    text: 'Flip 2 coins. For each heads, remove 3 damage counters from 1 of your Pokémon.'
  },
  {
    name: 'Continuous Tumble',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Miltank';
  public fullName: string = 'Miltank SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Healing Milk
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        if (heads === 0) {
          return;
        }

        const blocked: CardTarget[] = [];
        let hasPokemonWithDamage = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
          if (cardList.damage === 0) {
            blocked.push(target);
          } else {
            hasPokemonWithDamage = true;
          }
        });
        if (!hasPokemonWithDamage) {
          return;
        }

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false, blocked }
        ), selected => {
          const targets = selected || [];
          if (targets.length > 0) {
            const healEffect = new HealEffect(player, targets[0], 30 * heads);
            store.reduceEffect(state, healEffect);
          }
        });
      });
    }

    // Continuous Tumble
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, 20);
    }

    return state;
  }
}
