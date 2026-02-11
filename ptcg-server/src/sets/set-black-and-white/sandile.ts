import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Sandile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Sand-Attack',
      cost: [F],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon\'s attacks do nothing during your opponent\'s next turn.'
    },
    {
      name: 'Bite',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Sandile';
  public fullName: string = 'Sandile BLW';

  public readonly SAND_ATTACK_MARKER = 'SAND_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          opponent.active.marker.addMarker(this.SAND_ATTACK_MARKER, this);
        }
      });
    }

    // Block attacks if marked
    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.SAND_ATTACK_MARKER, this)) {
      effect.damage = 0;
      effect.preventDefault = true;
    }

    // Clean up marker at end of turn
    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.SAND_ATTACK_MARKER, this);
    }

    return state;
  }
}
