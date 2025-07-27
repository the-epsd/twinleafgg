import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonPlayedTurnEffect } from '../../game/store/effects/check-effects';

export class Wishiwashi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 30;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Cowardice',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard all cards attached to this Pokémon and return it to your hand. You can\'t use this Ability during your first turn or on the turn this Pokémon was put into play.'
  }];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Wishiwashi';
  public fullName: string = 'Wishiwashi SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);

      const playedTurnEffect = new CheckPokemonPlayedTurnEffect(player, cardList as PokemonCardList);
      store.reduceEffect(state, playedTurnEffect);
      if (playedTurnEffect.pokemonPlayedTurn === state.turn) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const pokemonCardList = cardList as PokemonCardList;
      const wishiwashiCard = pokemonCardList.getPokemonCard();
      if (!wishiwashiCard) {
        return state;
      }

      const pokemons = pokemonCardList.getPokemons();
      const otherCards = cardList.cards.filter(card =>
        !(card instanceof PokemonCard) &&
        (!pokemonCardList.tools || !pokemonCardList.tools.includes(card))
      );
      const tools = [...pokemonCardList.tools];

      // Move tools to discard first
      if (tools.length > 0) {
        for (const tool of tools) {
          pokemonCardList.moveCardTo(tool, player.discard);
        }
      }

      // Move other cards to discard
      if (otherCards.length > 0) {
        MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
      }

      // Move Pokémon to hand
      if (pokemons.length > 0) {
        MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
      }
    }

    return state;
  }
}