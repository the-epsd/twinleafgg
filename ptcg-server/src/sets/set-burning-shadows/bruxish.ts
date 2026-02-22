import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { PlayerType, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
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