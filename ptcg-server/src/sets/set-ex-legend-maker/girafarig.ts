import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, GameError, StateUtils, CardList, OrderCardsPrompt, SelectPrompt, EnergyCard, PlayerType, PokemonCardList } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Girafarig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public retreat = [C];
  public weakness = [{ type: P }];

  public powers = [{
    name: 'Rear Sensor',
    powerType: PowerType.POKEBODY,
    text: 'Each player\'s Active Basic Pokémon (excluding Pokémon-ex) can\'t use any Poké-Powers.'
  }];

  public attacks = [
    {
      name: 'Foresight',
      cost: [C],
      damage: 0,
      text: 'Look at the top 5 cards on either player\'s deck and put them back on top of that player\'s deck in any order you like.'
    },
    {
      name: 'Disorder',
      cost: [P, C],
      damage: 20,
      text: 'If the Defending Pokémon has any Special Energy cards attached to it, the Defending Pokémon is now Confused.'
    }
  ];

  public set: string = 'LM';
  public name: string = 'Girafarig';
  public fullName: string = 'Girafarig LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Block Poké-Powers from basics when active
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      const player = effect.player;
      const thisCardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, thisCardList);
      const opponent = StateUtils.getOpponent(state, player);

      let isGirafarigInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isGirafarigInPlay = true;
        }
      });

      if (!isGirafarigInPlay) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      // Only check opponent's Active Pokemon
      if (player.active.getPokemonCard() !== effect.card) {
        return state;
      }

      let effectCardList: PokemonCardList | undefined;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === effect.card) {
          effectCardList = cardList;
        }
      });

      if (effectCardList?.getPokemons().length === 1 || effect.card.tags.includes(CardTag.LEGEND) && !effect.card.tags.includes(CardTag.POKEMON_ex)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Drag Off
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.ORDER_YOUR_DECK,
          action: () => {

            if (player.deck.cards.length === 0) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }

            const deckTop = new CardList();
            player.deck.moveTo(deckTop, 5);

            return store.prompt(state, new OrderCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARDS_ORDER,
              deckTop,
              { allowCancel: false },
            ), order => {
              if (order === null) {
                return state;
              }

              deckTop.applyOrder(order);
              deckTop.moveToTopOfDestination(player.deck);

            });

          }
        },
        {
          message: GameMessage.ORDER_OPPONENT_DECK,
          action: () => {
            if (opponent.deck.cards.length === 0) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }

            const deckTop = new CardList();
            opponent.deck.moveTo(deckTop, 5);

            return store.prompt(state, new OrderCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARDS_ORDER,
              deckTop,
              { allowCancel: false },
            ), order => {
              if (order === null) {
                return state;
              }

              deckTop.applyOrder(order);
              deckTop.moveToTopOfDestination(opponent.deck);

            });

          }
        }
      ];

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      const opponent = effect.opponent;
      const pokemon = opponent.active;

      let specialEnergyCount = 0;

      pokemon.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          if (c.energyType === EnergyType.SPECIAL) {
            specialEnergyCount++;
          }
        }
      });

      if (specialEnergyCount > 0) {
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      }
    }

    return state;
  }

}
