import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PutCountersEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';

export class Dusclops extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Duskull';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D, value: 20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Roam',
    cost: [P, C],
    damage: 0,
    text: 'Flip a coin. If heads, put 2 damage counters on each of your opponent\'s Pokémon. If tails, put 2 damage counters on 1 of your Pokémon.'
  },
  {
    name: 'Gravity Wave',
    cost: [P, P],
    damage: 30,
    text: 'Does 10 damage to each of your opponent\'s Benched Pokémon that doesn\'t have a Retreat Cost. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Dusclops';
  public fullName: string = 'Dusclops DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Roam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
            const damageEffect = new PutCountersEffect(effect, 20);
            damageEffect.target = cardList;
            store.reduceEffect(state, damageEffect);
          });
        } else {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { min: 1, max: 1, allowCancel: false }
          ), targets => {
            if (!targets || targets.length === 0) {
              return;
            }
            const damageEffect = new PutCountersEffect(effect, 20);
            damageEffect.target = targets[0];
            store.reduceEffect(state, damageEffect);
          });
        }
      });
    }

    // Gravity Wave
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.bench.forEach(cardList => {
        if (cardList.cards.length === 0) {
          return;
        }
        const pokemonCard = cardList.getPokemonCard();
        if (pokemonCard && pokemonCard.retreat.length === 0) {
          const putDamage = new PutDamageEffect(effect, 10);
          putDamage.target = cardList;
          store.reduceEffect(state, putDamage);
        }
      });
    }

    return state;
  }
}
