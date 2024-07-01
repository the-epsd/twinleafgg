import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, GameError, Card, PokemonCardList, ShuffleDeckPrompt, PokemonCard, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';


export class BuddyBuddyPoffin extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '144';

  public regulationMark = 'H';

  public name: string = 'Buddy-Buddy Poffin';

  public fullName: string = 'Buddy-Buddy Poffin TEF';

  public text: string =
    'Search your deck for up to 2 Basic Pokémon with 70 HP or less and put them onto your Bench. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
        
      const player = effect.player;

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        // eslint-disable-next-line no-empty
        if (c instanceof PokemonCard && c.stage === Stage.BASIC && c.hp <= 70) {
          
        } else {
          blocked.push(index);
        }
      });

      // Allow player to search deck and choose up to 2 Basic Pokemon
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
    
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      } else {
        // Check if bench has open slots
        const openSlots = player.bench.filter(b => b.cards.length === 0);
      
        if (openSlots.length === 0) {
          // No open slots, throw error
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }
          
        const maxPokemons = Math.min(openSlots.length, 2);

        // We will discard this card after prompt confirmation
        effect.preventDefault = true;
        player.hand.moveCardTo(effect.trainerCard, player.supporter);
           
        let cards: Card[] = [];
        return store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.deck,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 0, max: maxPokemons, allowCancel: false, blocked, maxPokemons }
        ), selectedCards => {
          cards = selectedCards || [];
        
          cards.forEach((card, index) => {
            player.deck.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
            store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });
          });

          player.supporter.moveCardTo(this, player.discard);
        
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
              
            return state;
          }
          );
        });
      }
    }
    return state;
  }
}
