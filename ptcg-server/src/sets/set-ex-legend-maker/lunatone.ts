import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, GameError, StateUtils, PlayerType, PokemonCardList, ChooseCardsPrompt, Card, TrainerCard } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Lunatone extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Luna Shade',
    powerType: PowerType.POKEBODY,
    text: 'As long as you have Solrock in play, each player\'s [R] Pokémon (excluding Pokémon-ex) can\'t use any Poké-Powers.'
  }];

  public attacks = [
    {
      name: 'Moon Guidance',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Trainer card (excluding Supporter cards), show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
    },
    {
      name: 'Psyshock',
      cost: [P],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public set: string = 'LM';
  public name: string = 'Lunatone';
  public fullName: string = 'Lunatone LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';

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

      let isSolrockInPlay = false;
      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Solrock') {
          isSolrockInPlay = true;
        }
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isSolrockInPlay || !isThisInPlay) {
        return state;
      }

      let cardTypes = [effect.card.cardType];
      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        cardTypes = checkPokemonType.cardTypes;
      }

      // We are blocking the powers from fire Pokemon
      if (!cardTypes.includes(CardType.FIRE)) {
        return state;
      }

      if (!effect.card.tags.includes(CardTag.POKEMON_ex)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Moon Guidance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      // TODO: make this format dependent (only items in modern or unlimited fomrats)
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER) {
          blocked.push(index);
        }
      });

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false, blocked }
      ), selected => {
        cards = selected || [];

        if (selected.length === 0) { return state; }

        SHOW_CARDS_TO_PLAYER(store, state, effect.opponent, cards);
        MOVE_CARDS(store, state, player.deck, player.hand, { cards: selected, sourceCard: this, sourceEffect: this.attacks[0] });
        SHUFFLE_DECK(store, state, player);
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }

}
