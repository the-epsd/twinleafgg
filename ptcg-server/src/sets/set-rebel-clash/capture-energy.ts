import { Card, ChooseCardsPrompt, GameMessage } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class CaptureEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'RCL';

  public regulationMark = 'D';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '171';

  public name = 'Capture Energy';

  public fullName = 'Capture Energy RCL';

  public text =
    'This card provides [C] Energy.' +
    '' +
    'When you attach this card from your hand to a Pokémon, search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;
      
      const slots = player.bench.filter(b => b.cards.length === 0).length;

      if (slots === 0) {
        return state;
      }

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      
      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: 1, allowCancel: false }
      ), selectedCards => {
        cards = selectedCards || [];

        // Operation canceled by the user
        if (cards.length === 0) {
          return state;
        }
      });
    }      
      
    return state;
  }
      
}
      