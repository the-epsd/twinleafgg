import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class RadiantCharizard extends PokemonCard {

  public tags = [CardTag.RADIANT];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 160;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Excited Heart',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon\'s attacks cost C less for each Prize card your opponent has taken.'
  }];

  public attacks = [
    {
      name: 'Combustion Blast',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 250,
      text: 'During your next turn, this Pokémon can\'t use Combustion Blast.'
    }
  ];

  public set: string = 'CRZ';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '20';

  public name: string = 'Radiant Charizard';

  public fullName: string = 'Radiant Charizard CRZ';

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
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
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
        1: 4
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
    // if (effect instanceof KnockOutEffect) {
    //   const player = effect.player;
    //   const opponent = StateUtils.getOpponent(state, player);
    //   const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);

    //   // Do not activate between turns, or when it's not opponents turn.
    //   if (!duringTurn || state.players[state.activePlayer] !== opponent) {
    //     return state;
    //   }

    //   const cardList = StateUtils.findCardList(state, this);
    //   const owner = StateUtils.findOwner(state, cardList);
    //   if (owner === player) {

    //     try {
    //       const stub = new PowerEffect(player, {
    //         name: 'test',
    //         powerType: PowerType.ABILITY,
    //         text: ''
    //       }, this);
    //       store.reduceEffect(state, stub);
    //     } catch {
    //       return state;
    //     }

    //     const card = effect.target.getPokemonCard();
    //     if (card !== undefined) {

    //       let costToReduce = 1;

    //       if (card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_ex)) {
    //         costToReduce += 1;
    //       }

    //       if (card.tags.includes(CardTag.POKEMON_VMAX)) {
    //         costToReduce += 2;
    //       }

    //       const index = this.attacks[0].cost.indexOf(CardType.COLORLESS);
    //       if (index !== -1) {
    //         this.attacks[0].cost.splice(index, costToReduce);
    //         console.log(this.attacks[0].cost);
    //       }
    //     }
    //   }
    // }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }
    return state;
  }
}
