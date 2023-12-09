import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class ForestSealStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SIT';

  public set2: string = 'silvertempest';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Forest Seal Stone';

  public fullName: string = 'Forest Seal Stone SIT';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public attacks = [
    {
      name: 'Laser Blade',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 200,
      text: ''
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.target.tool === this) {
      const pokemon = effect.target.getPokemonCard();
      pokemon.attacks.push(this.attacks[0]);
      return state;
    }

    return state;
  }

    
  //       const player = effect.player;
  //       if (player.marker.hasMarker(this.VSTAR_MARKER)) {
  //         throw new GameError(GameMessage.POWER_ALREADY_USED);
  //       }

  //       player.marker.addMarker(this.VSTAR_MARKER, this);
  //       state = store.prompt(state, new ChooseCardsPrompt(
  //         player.id,
  //         GameMessage.CHOOSE_CARD_TO_HAND,
  //         player.deck,
  //         {},
  //         { min: 1, max: 1, allowCancel: false }
  //       ), cards => {
  //         player.deck.moveCardsTo(cards, player.hand);

  //         state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
  //           player.deck.applyOrder(order);
  //         });
  //         return state;
  //       });
        
  //     }
  //     return state;
  //   }
  // }
  
}