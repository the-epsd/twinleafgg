import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slakoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public readonly LAZY_HOWL_MARKER = 'SLAKOTH_UNM_LAZY_HOWL_MARKER';
  public readonly CLEAR_LAZY_HOWL_MARKER = 'SLAKOTH_UNM_CLEAR_LAZY_HOWL_MARKER';

  public attacks = [
    {
      name: 'Lazy Howl',
      cost: [C],
      damage: 0,
      text: 'During your opponent\'s next turn, if they attach an Energy card from their hand to the Defending Pokémon, their turn ends.'
    },
    {
      name: 'Hang Down',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '167';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slakoth';
  public fullName: string = 'Slakoth UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Lazy Howl
    // Ref: Custom implementation - intercept AttachEnergyEffect and end opponent's turn via EndTurnEffect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.marker.addMarker(this.LAZY_HOWL_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_LAZY_HOWL_MARKER, this);
    }

    // Intercept energy attachment to the marked Pokemon
    if (effect instanceof AttachEnergyEffect
      && effect.target.marker.hasMarker(this.LAZY_HOWL_MARKER, this)) {
      // If energy is being attached from hand, end the opponent's turn
      const player = effect.player;
      if (player.hand.cards.includes(effect.energyCard)) {
        const endTurnEffect = new EndTurnEffect(player);
        store.reduceEffect(state, endTurnEffect);
      }
    }

    // Cleanup
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_LAZY_HOWL_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_LAZY_HOWL_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.active.marker.removeMarker(this.LAZY_HOWL_MARKER, this);
    }

    return state;
  }
}
