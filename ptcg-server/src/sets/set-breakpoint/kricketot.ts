import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameMessage } from '../../game/game-message';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';

export class Kricketot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];
  public attacks = [{
    name: 'Bug Hunch',
    cost: [CardType.GRASS],
    damage: 0,
    text: 'Search your deck for up to 3 [G] Pokémon, reveal them, and put them into your hand. Shuffle your deck afterward.'
  }
  ];
  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Kricketot';
  public fullName: string = 'Kricketot BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, new ChooseCardsPrompt(
        player, 
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck, 
        { superType: SuperType.POKEMON, cardType: CardType.GRASS },
        { min: 0, max: 3, allowCancel: true }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);
  
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }
}