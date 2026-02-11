import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Steelix extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public cardType: CardType = M;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Metal Defender',
      cost: [M, C, C],
      damage: 50,
      text: 'During your opponent\'s next turn, this Pokémon has no Weakness.'
    },
    {
      name: 'Heavy Impact',
      cost: [M, C, C, C, C],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '79';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix PLF';

  public readonly METAL_DEFENDER_MARKER = 'STEELIX_METAL_DEFENDER_MARKER';
  public readonly CLEAR_METAL_DEFENDER_MARKER = 'STEELIX_CLEAR_METAL_DEFENDER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Metal Defender - no weakness during opponent's next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.METAL_DEFENDER_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_METAL_DEFENDER_MARKER, this);
    }

    // Remove weakness when marker is present
    if (effect instanceof CheckPokemonStatsEffect) {
      if (effect.target.marker.hasMarker(this.METAL_DEFENDER_MARKER, this)) {
        effect.weakness = [];
      }
    }

    // Clean up at end of opponent's turn
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_METAL_DEFENDER_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_METAL_DEFENDER_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(this.METAL_DEFENDER_MARKER, this);
      });
    }

    return state;
  }
}
