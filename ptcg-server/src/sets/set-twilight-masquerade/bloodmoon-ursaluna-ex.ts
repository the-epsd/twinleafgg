import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class BloodmoonUrsalunaex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 260;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Seasoned Skill',
    powerType: PowerType.ABILITY,
    text: 'Blood Moon used by this Pokémon costs [C] less for each Prize card your opponent has taken.'
  }];

  public attacks = [
    {
      name: 'Blood Moon',
      cost: [C, C, C, C, C],
      damage: 240,
      text: 'This Pokémon can\'t attack during your next turn.'
    }
  ];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public setNumber: string = '141';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bloodmoon Ursaluna ex';
  public fullName: string = 'Bloodmoon Ursaluna ex TWM';

  // public getColorlessReduction(state: State): number {
  //   const player = state.players[state.activePlayer];
  //   const opponent = StateUtils.getOpponent(state, player);
  //   const remainingPrizes = opponent.getPrizeLeft();
  //   return 6 - remainingPrizes;
  // }

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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

      const index = effect.cost.indexOf(CardType.COLORLESS);

      if (index === -1) {
        return state;
      }

      const remainingPrizes = opponent.getPrizeLeft();

      const prizeToColorlessReduction: { [key: number]: number } = {
        5: 1,
        4: 2,
        3: 3,
        2: 4,
        1: 5
      };

      const colorlessToRemove = prizeToColorlessReduction[remainingPrizes as keyof typeof prizeToColorlessReduction] || 0;

      for (let i = 0; i < colorlessToRemove; i++) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
      return state;
    }

    if (effect instanceof UseAttackEffect && effect.source.cards.includes(this)) {
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }
    return state;
  }
}
