import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage, PowerType } from '../../game';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Munkidoriex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_ex];

  public regulationMark = 'H';

  public cardType: CardType = CardType.DARK;

  public weakness = [{ type: CardType.FIGHTING }];

  public hp: number = 210;

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Oh No You Don\'t',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an opponent\'s attack while you have Pecharunt ex in play, your opponent takes one less prize card.'
  }];

  public attacks = [{
    name: 'Dirty Headbutt',
    cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
    damage: 190,
    text: 'This Pokémon can\'t use Dirty Headbutt during your next turn.'
  }];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '37';

  public name: string = 'Munkidori ex';

  public fullName: string = 'Munkidori ex SFA';

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

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

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

      if (player.pecharuntexIsInPlay == true) {
        effect.prizeCount -= 1;
      }
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
    return state;
  }
}
