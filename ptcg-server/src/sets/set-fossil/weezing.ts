import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, StateUtils, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Koffing';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Smog',
    cost: [G, G],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Selfdestruct',
    cost: [G, G, C],
    damage: 60,
    text: 'Does 10 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Weezing does 60 damage to itself.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Weezing';
  public fullName: string = 'Weezing FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(
        state,
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        flipResult => {
          if (flipResult) {
            const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
          }
        });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.damage += 60;
        }
      });
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === player.active) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList === opponent.active) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}