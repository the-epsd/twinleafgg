import { ChooseCardsPrompt, PokemonCard, ShuffleDeckPrompt } from '../../game';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class GreensExploration extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '175';

  public name: string = 'Greens Exploration';

  public fullName: string = 'Greens Exploration UNB';

  public text: string =
    'You can play this card only if you have no Pokémon with Abilities in play.' + 
    '' + 
    'Search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      
      const benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
      const pokemonWithAbilities = benchPokemon.filter(card => card.powers.length);
      const playerActive = player.active.getPokemonCard();
      
      if (playerActive && playerActive.powers.length) {
        pokemonWithAbilities.push(playerActive);
      }

      if (pokemonWithAbilities.length > 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);        
      }
  
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.deck,
        { superType: SuperType.TRAINER },
        { min: 0, max: 2, allowCancel: false }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          player.deck.moveCardsTo(cards, player.hand);

          state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
          
          cards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });
        }
        return state;
      });
    }
    return state;
  }
}