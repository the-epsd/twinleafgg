import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, GameError, ShuffleDeckPrompt, PokemonCard, GameLog } from '../../game';
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
    if ((effect instanceof TrainerEffect && effect.trainerCard === this)) {
      const player = effect.player;
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0 || openSlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked = player.deck.cards.reduce((acc, c, index) => {
        if (!(c instanceof PokemonCard && c.stage === Stage.BASIC && c.hp <= 70)) {
          acc.push(index);
        }
        return acc;
      }, [] as number[]);

      const maxPokemons = Math.min(openSlots.length, 2);
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: maxPokemons, allowCancel: false, blocked, maxPokemons }
      ), selectedCards => {
        const cards = selectedCards || [];

        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, openSlots[index]);
          openSlots[index].pokemonPlayedTurn = state.turn;
          store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });
        });

        player.supporter.moveCardTo(this, player.discard);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          return state;
        });
      });
    }
    return state;
  }
}