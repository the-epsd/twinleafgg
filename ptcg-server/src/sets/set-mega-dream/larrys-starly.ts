import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { WAS_ATTACK_USED, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { GameMessage } from '../../game';

export class LarrysStarly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.LARRYS];
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: '',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 Basic Energy, reveal them, and put them into your hand. Then, shuffle your deck.'
  },
  {
    name: '',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Larry\'s Starly';
  public fullName: string = 'Larry\'s Starly M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        cards.forEach(card => {
          player.deck.moveCardTo(card, player.hand);
        });
        SHUFFLE_DECK(store, state, player);
      });
    }
    return state;
  }
}


