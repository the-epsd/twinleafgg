import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class CastformSnowyForm extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'E';
  public cardType: CardType = CardType.WATER;
  public hp = 70;
  public weakness = [{ type: CardType.METAL }];
  public resistance = [];
  public retreat = [];

  public powers = [
    {
      name: 'Weather Reading',
      text: 'If you have 8 or more Stadium cards in your discard pile, ignore all Energy in this Pokémon\'s attack costs.',
      powerType: PowerType.ABILITY,
      useWhenInPlay: false,
    }
  ];

  public attacks = [{
    name: 'Frosty Typhoon',
    cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
    damage: 120,
    text: 'During your next turn, this Pokémon can\'t use Frosty Typhoon.'
  }];

  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Castform Snowy Form';
  public fullName: string = 'Castform Snowy Form CRE';

  public getColorlessReduction(state: State): number {
    const player = state.players[state.activePlayer];
    const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof TrainerCard && (<TrainerCard>c).trainerType === TrainerType.STADIUM).length

    return stadiumsInDiscard >= 8 ? 2 : 0;
  }

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');

    }

    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof TrainerCard && (<TrainerCard>c).trainerType === TrainerType.STADIUM).length

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

      if (stadiumsInDiscard >= 8) {

        const costToRemove = 3;

        for (let i = 0; i < costToRemove; i++) {
          let index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          } else {
            index = effect.cost.indexOf(CardType.WATER);
            if (index !== -1) {
              effect.cost.splice(index, 1);
            }
          }
        }
      }
    }

    return state;
  }
}