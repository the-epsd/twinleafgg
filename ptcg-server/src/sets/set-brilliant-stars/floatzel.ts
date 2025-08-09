import { State, StoreLike, TrainerCard } from '../../game';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Floatzel extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.WATER;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public evolvesFrom = 'Buizel';

  public attacks = [
    {
      name: 'Floatify',
      cost: [CardType.WATER],
      damage: 0,
      text: 'Put up to 2 Item cards from your discard pile into your hand.'
    },
    {
      name: 'Water Gun',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'BRS';

  public name: string = 'Floatzel';

  public fullName: string = 'Floatzel BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;

      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (card instanceof TrainerCard && (card.trainerType !== TrainerType.ITEM)) {
          blocked.push(index);
        }
      });

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false, blocked }, this.attacks[0]);
    }

    return state;
  }

}
