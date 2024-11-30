import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class BloodmoonUrsalunaex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 260;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Seasoned Skill',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon\'s Blood Moon attacks costs 1 Colorless less to use for each Prize card your opponent has already taken.'
  }];

  public attacks = [
    {
      name: 'Blood Moon',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 240,
      text: 'This Pokémon can\'t attack during your next turn.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '141';

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

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // const index = effect.cost.indexOf(CardType.COLORLESS);

      // // No cost to reduce
      // if (index === -1) {
      //   return state;
      // }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        console.log(effect.cost);
        return state;
      }

      const index = effect.cost.indexOf(CardType.COLORLESS);

      // No cost to reduce
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

      console.log(effect.cost);

      return state;

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
    }
    return state;
  }
}
