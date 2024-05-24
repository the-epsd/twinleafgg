import { PokemonCard, Stage, CardType, StoreLike, State, PowerType, ChooseCardsPrompt, ConfirmPrompt, GameMessage, ShowCardsPrompt, StateUtils, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Drizzile extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Sobble';

  public cardType: CardType = CardType.WATER;

  public hp: number = 90;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Shady Dealings',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may search your deck for a Trainer card, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Water Drip',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];
  
  public regulationMark = 'D';

  public set: string = 'SSH';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '42';
  
  public name: string = 'Drizzile';
  
  public fullName: string = 'Drizzile SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      if (player.deck.cards.length === 0) {
        return state;
      }
      
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
      
          state = store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            { superType: SuperType.TRAINER },
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            const cards = selected || [];
  
            store.prompt(state, [new ShowCardsPrompt(
              opponent.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              cards
            )], () => {
              player.deck.moveCardsTo(cards, player.hand);
            });
            return state;
          });
        }
      });
    }
    return state;
  }
}