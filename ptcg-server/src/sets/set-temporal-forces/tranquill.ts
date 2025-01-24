import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Tranquill extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pidove';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public attacks = [
    {
      name: 'Speed Dive',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: ''
    },
    {
      name: 'Jet Wing',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'TEF';

  public setNumber = '134';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Tranquill';

  public fullName: string = 'Tranquill TEF';

  // for preventing the pokemon from attacking on the next turn
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Speed Dive
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Jet Wing
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    // removing the markers for preventing the pokemon from attacking
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    return state;
  }
}