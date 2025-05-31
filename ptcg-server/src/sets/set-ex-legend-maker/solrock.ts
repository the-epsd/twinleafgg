import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, GameError, StateUtils, PlayerType, PokemonCardList, ChooseCardsPrompt } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Solrock extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Luna Shade',
    powerType: PowerType.POKEBODY,
    text: 'As long as you have Lunatone in play, each player\'s [C] Pokémon (excluding Pokémon-ex) can\'t use any Poké-Powers.'
  }];

  public attacks = [
    {
      name: 'Call for Family',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Lunatone and put it onto your Bench. Shuffle your deck afterward.'
    },
    {
      name: 'Hyper Beam',
      cost: [F],
      damage: 0,
      text: 'Flip a coin. If heads, discard an Energy card attached to the Defending Pokémon.'
    }
  ];

  public set: string = 'LM';
  public name: string = 'Solrock';
  public fullName: string = 'Solrock LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Block Poké-Powers from basics when active
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      const player = effect.player;
      const thisCardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, thisCardList);
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      let isLunatoneInPlay = false;
      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Lunatone') {
          isLunatoneInPlay = true;
        }
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isLunatoneInPlay || !isThisInPlay) {
        return state;
      }

      let cardTypes = [effect.card.cardType];
      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        cardTypes = checkPokemonType.cardTypes;
      }

      // We are blocking the powers from colorless Pokemon
      if (!cardTypes.includes(CardType.COLORLESS)) {
        return state;
      }

      if (!effect.card.tags.includes(CardTag.POKEMON_ex)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Call for Family
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name === 'Lunatone') {
          return;
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store, state, effect.player, {}, { min: 0, max: 1, blocked }
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            const card = selected[0];

            opponent.active.moveCardTo(card, opponent.discard);
            return state;
          });
        }
      });
    }

    return state;
  }

}
