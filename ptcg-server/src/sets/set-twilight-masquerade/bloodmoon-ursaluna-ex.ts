import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class BloodmoonUrsalunaex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 260;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Elder\'s Technique',
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

    if (effect instanceof CheckAttackCostEffect) {
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

      const prizesTaken = 6 - opponent.getPrizeLeft();
      const index = effect.attack.cost.findIndex(c => c === CardType.COLORLESS);

      if (index !== -1) {
        this.attacks.forEach(attack => {
          attack.cost.splice(index, prizesTaken);
        });


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
    return state;
  }

}