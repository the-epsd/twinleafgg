import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class HisuianOverqwil extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Hisuian Qwilfish';
  public cardType: CardType = CardType.DARK;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Tormenting Poison',
    cost: [],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.During Pokémon Checkup, put 5 damage counters on that Pokémon instead of 1. '
  },
  {
    name: 'Pinning',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 50,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat. '
  }];

  public set: string = 'ASR';
  public setNumber: string = '90';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hisuian Overqwil';
  public fullName: string = 'Hisuian Overqwil ASR';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 50;
      store.reduceEffect(state, specialCondition);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    return state;
  }
}