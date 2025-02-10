import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt, PowerType, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CONFIRMATION_PROMPT, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 40;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [ C ];

  public powers = [{
    name: 'Swelling Spite',
    powerType: PowerType.ABILITY,
    text: 'When this Pokémon is Knocked Out, search your deck for up to 2 Haunter and put them onto your Bench. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Will-O-Wisp',
      cost: [ C, C ],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Gastly';
  public fullName: string = 'Gastly UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      // i love checking for ability lock woooo
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const openSlots = player.bench.filter(b => b.cards.length === 0);
          
      if (player.deck.cards.length === 0 || openSlots.length === 0) {
        return state;
      }

      store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: this.name });

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result){
          const maxPokemons = Math.min(openSlots.length, 2);
    
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
            player.deck,
            { superType: SuperType.POKEMON, name: 'Haunter' },
            { min: 0, max: Math.min(2, maxPokemons), allowCancel: false }
          ), selectedCards => {
            const cards = selectedCards || [];
    
            cards.forEach((card, index) => {
              player.deck.moveCardTo(card, openSlots[index]);
              openSlots[index].pokemonPlayedTurn = state.turn;
            });
    
            SHUFFLE_DECK(store, state, player);
    
          });
        }
      });
    }

    return state;
  }
}