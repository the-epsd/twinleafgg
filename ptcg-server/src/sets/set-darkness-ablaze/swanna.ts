import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChooseCardsPrompt, Card } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

function* useFeatherSlice(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  // If our hand is empty, don't give a discard prompt.
  if (player.hand.cards.length == 0) { return state; }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.hand,
    {},
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  // If we decided not to discard, just do 70 damage.
  if (cards.length === 0) { return state; }

  // Else, discard the card and do 140 damage.
  player.hand.moveCardsTo(cards, player.discard);
  effect.damage += 70;
  return state;
}

export class Swanna extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Ducklett';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public powers = [
    {
      name: 'Sky Circus',
      powerType: PowerType.ABILITY,
      text: 'If you played Bird Keeper from your hand during this turn, ignore all Energy in this Pokemon\'s attack costs.',
    }
  ];

  public attacks = [
    {
      name: 'Feather Slice',
      cost: [C, C, C],
      damage: 70,
      text: 'You may discard a card from your hand. If you do, this attack does 70 more damage.',
    }
  ];

  public regulationMark = 'D';

  public set: string = 'DAA';

  public setNumber: string = '149';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Swanna';

  public fullName: string = 'Swanna DAA';

  private readonly SWANNA_SKY_CIRCUS_MARKER = 'SWANNA_SKY_CIRCUS_MARKER';

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

      effect.player.marker.addMarker(this.SWANNA_SKY_CIRCUS_MARKER, effect.trainerCard);
    }

    if (effect instanceof CheckAttackCostEffect && effect.player.marker.hasMarker(this.SWANNA_SKY_CIRCUS_MARKER)) {
      // If we have the marker, the attack cost will be free.
      effect.cost = [];
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      // Remove marker at the end of turn.
      effect.player.marker.removeMarker(this.SWANNA_SKY_CIRCUS_MARKER);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useFeatherSlice(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}