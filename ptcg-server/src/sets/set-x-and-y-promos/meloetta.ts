import { CoinFlipPrompt, GameMessage, PlayerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Meloetta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 80;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Soprano Wave',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'Flip 3 coins. This attack does 10 damage times the number of heads to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Entrancing Melody',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC],
    damage: 30,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'XYP';
  public setNumber: string = '193';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Meloetta';
  public fullName: string = 'Meloetta XYP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let heads: number = 0;
      store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        results.forEach(r => { heads += r ? 1 : 0; });

        if (heads === 0) {
          return state;
        }
        
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          const damage = 10 * heads;
          const damageEffect = new PutDamageEffect(effect, damage);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        });
        
        return state;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}