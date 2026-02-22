import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AFTER_ATTACK, IS_ABILITY_BLOCKED, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

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
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      effect.player.marker.addMarker(this.STARLY_SKY_CIRCUS_MARKER, effect.trainerCard);
    }

    if (effect instanceof CheckAttackCostEffect && effect.player.marker.hasMarker(this.STARLY_SKY_CIRCUS_MARKER)) {
      // If we have the marker, the attack cost will be free.
      effect.cost = [];
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.STARLY_SKY_CIRCUS_MARKER, this)) {
      // Remove marker at the end of turn.
      effect.player.marker.removeMarker(this.STARLY_SKY_CIRCUS_MARKER);
    }

    // Keen Eye
    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 0, max: 2, allowCancel: true }, this.attacks[0]);
    }

    return state;
  }

}