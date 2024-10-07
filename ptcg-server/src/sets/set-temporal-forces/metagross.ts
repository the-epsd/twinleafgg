import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Metagross extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Metang';

  public regulationMark = 'H';

  public cardType: CardType = CardType.METAL;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Meteor Mash',
      cost: [CardType.METAL],
      damage: 60,
      text: 'During your next turn, this Pokémon\'s Meteor Mash attack does 60 more damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Luster Blast',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 200,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public name: string = 'Metagross';

  public fullName: string = 'Metagross TEF';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.player.attackMarker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
      effect.player.attackMarker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
      console.log('both markers cleared - used another attack');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Check marker
      if (effect.player.attackMarker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
        console.log('attack added damage');
        effect.damage += 60;
      }
      effect.player.attackMarker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
      console.log('marker added');
    }
    return state;
  }
}