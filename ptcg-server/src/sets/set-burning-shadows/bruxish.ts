import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { PlayerType, StateUtils } from '../../game';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Bruxish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Gnash Teeth',
      cost: [W],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Confused.',
    },
    {
      name: 'Synchronoise',
      cost: [W, C, C],
      damage: 60,
      text: 'This attack does 20 damage to each of your opponent\'s Benched Pokémon that shares a type with your opponent\'s Active Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
    }
  ];

  public set: string = 'BUS';
  public name: string = 'Bruxish';
  public fullName: string = 'Bruxish BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defendingPokemon = opponent.active;

      if (defendingPokemon.cards.length > 0) {
        const defendingCard = defendingPokemon.cards[0] as PokemonCard;
        const defendingType = defendingCard.cardType;

        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          if (cardList !== defendingPokemon && cardList.cards.length > 0) {
            const card = cardList.cards[0] as PokemonCard;
            if (card.cardType === defendingType) {
              const damageEffect = new PutDamageEffect(effect, 20);
              damageEffect.target = cardList;
              state = store.reduceEffect(state, damageEffect);
            }
          }
          return state;
        });
      }
    }
    return state;
  }
}