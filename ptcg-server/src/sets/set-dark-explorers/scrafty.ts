import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Scrafty extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Scraggy';

  public cardType: CardType = CardType.DARK;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Headbutt',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Crushing Blow',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 70,
      text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokemon.'
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Scrafty';

  public fullName: string = 'Scrafty DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crushing Blow - flip for energy discard
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const opponentActive = opponent.active;
          const energyCards = opponentActive.cards.filter(c => c.superType === SuperType.ENERGY);
          if (energyCards.length > 0) {
            const discardEffect = new DiscardCardsEffect(effect, energyCards.slice(0, 1));
            discardEffect.target = opponentActive;
            store.reduceEffect(state, discardEffect);
          }
        }
      });
    }

    return state;
  }

}
