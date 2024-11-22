import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, Card, ChooseCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

function* useKeenEye(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;
  if (player.deck.cards.length === 0) { return state; }

  // Choose two cards from our deck
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 1, max: 2, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Put them in our hand and shuffle our deck
  player.deck.moveCardsTo(cards, player.hand);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Starly extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 50;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Sky Circus',
      powerType: PowerType.ABILITY,
      text: 'If you played Bird Keeper from your hand during this turn, ignore all Energy in this Pokemon\'s attack costs.',
    }
  ];

  public attacks = [
    {
      name: 'Keen Eye',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
    }
  ];

  public regulationMark = 'D';

  public set: string = 'DAA';

  public setNumber: string = '145';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Starly';

  public fullName: string = 'Starly DAA';

  private readonly STARLY_SKY_CIRCUS_MARKER = 'STARLY_SKY_CIRCUS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sky Circus
    if (effect instanceof TrainerEffect && effect.trainerCard.name == 'Bird Keeper') {
      // Put a "played Bird Keeper this turn" marker on ourselves.
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      effect.player.marker.addMarker(this.STARLY_SKY_CIRCUS_MARKER, effect.trainerCard);
    }

    if (effect instanceof CheckAttackCostEffect && effect.player.marker.hasMarker(this.STARLY_SKY_CIRCUS_MARKER)) {
      // If we have the marker, the attack cost will be free.
      effect.cost = [];
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      // Remove marker at the end of turn.
      effect.player.marker.removeMarker(this.STARLY_SKY_CIRCUS_MARKER);
    }

    // Keen Eye
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useKeenEye(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}