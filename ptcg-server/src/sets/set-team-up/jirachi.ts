import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, CardList, TrainerCard, ChooseCardsPrompt, Card, ShowCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
function* useStellarWish(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const deckTop = new CardList();
  player.deck.moveTo(deckTop, 5);

  const blocked: number[] = [];
  deckTop.cards.forEach((card, index) => {
    if (card instanceof TrainerCard && card.name === 'Trainers\' Mail') {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    deckTop,
    { superType: SuperType.TRAINER },
    { min: 1, max: 1, allowCancel: true, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  deckTop.moveCardsTo(cards, player.hand);
  deckTop.moveTo(player.deck);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Jirachi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Stellar Wish',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokemon is your Active Pokemon, you may look at the top 5 cards of your deck, reveal a Trainer card you find there, and put it into your hand. Then, shuffle the other cards back into your deck, and this Pokemon is now Asleep.'
  }];

  public attacks = [{
    name: 'Slap',
    cost: [CardType.METAL, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Jirachi';
  public fullName: string = 'Jirachi TEU';

  public readonly STELLAR_WISH_MARKER = 'STELLAR_WISH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.STELLAR_WISH_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
  
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
  
      if (player.marker.hasMarker(this.STELLAR_WISH_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.cards[0] !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      
      player.active.addSpecialCondition(SpecialCondition.ABILITY_USED);
      player.active.addSpecialCondition(SpecialCondition.ASLEEP);
      player.marker.addMarker(this.STELLAR_WISH_MARKER, this);
      
      const generator = useStellarWish(() => generator.next(), store, state, effect);
      return generator.next().value;
      

    }

    if (effect instanceof EndTurnEffect) {
      const player = (effect as EndTurnEffect).player;
      player.marker.removeMarker(this.STELLAR_WISH_MARKER, this);
    }

    return state;
  }
}