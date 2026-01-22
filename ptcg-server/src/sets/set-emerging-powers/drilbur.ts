import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Drilbur extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Hone Claws',
      cost: [C],
      damage: 0,
      text: 'During your next turn, each of this Pokémon\'s attacks does 30 more damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Scratch',
      cost: [F],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Drilbur';
  public fullName: string = 'Drilbur EPO';

  public readonly HONE_CLAWS_MARKER = 'HONE_CLAWS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.marker.addMarker(this.HONE_CLAWS_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      if (effect.player.active.marker.hasMarker(this.HONE_CLAWS_MARKER, this) && effect.attack !== this.attacks[0]) {
        effect.damage += 30;
      }
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.removeMarker(this.HONE_CLAWS_MARKER, this);
    }

    return state;
  }
}
