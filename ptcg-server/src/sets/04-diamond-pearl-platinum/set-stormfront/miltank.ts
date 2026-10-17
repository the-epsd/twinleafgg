import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { DRAW_CARDS, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Miltank extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Collect',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Energy Milk',
    cost: [C],
    damage: 0,
    text: 'Flip a coin until you get tails. For each heads, remove 2 damage counters from 1 of your Pokémon.'
  },
  {
    name: 'Stomp',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Miltank';
  public fullName: string = 'Miltank SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Collect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }

    // Energy Milk
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
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
          { min: 1, max: 1, allowCancel: false, blocked },
        ), results => {
          const targets = results || [];
          targets.forEach(target => {
            const healEffect = new HealEffect(player, target, Math.min(target.damage, heads * 20));
            store.reduceEffect(state, healEffect);
          });
        });
      });
    }

    // Stomp
    if (WAS_ATTACK_USED(effect, 2, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
