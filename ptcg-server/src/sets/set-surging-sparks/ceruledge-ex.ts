import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ceruledgeex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Charcadet';
  public cardType: CardType = CardType.FIRE;
  public hp: number = 270;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public weakness = [{ type: CardType.WATER }];
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public attacks = [
    {
      name: 'Abyssal Flame',
      cost: [CardType.FIRE],
      damage: 30,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each Energy card in your discard pile.'
    },
    {
      name: 'Amethyst Rage',
      cost: [CardType.FIRE, CardType.PSYCHIC, CardType.METAL],
      damage: 280,
      text: 'Discard all Energy from this Pokémon.'
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public name: string = 'Ceruledge ex';
  public fullName: string = 'Ceruledge ex SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energyInDiscard = player.discard.cards.filter(c => c.superType === SuperType.ENERGY).length;
      effect.damage += energyInDiscard * 20;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      if (cardList) {
        const energyCards = cardList.cards.filter(c => c.superType === SuperType.ENERGY);
        energyCards.forEach(c => {
          player.discard.cards.push(c);
        });
        cardList.cards = cardList.cards.filter(c => c.superType !== SuperType.ENERGY);
      }
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}
