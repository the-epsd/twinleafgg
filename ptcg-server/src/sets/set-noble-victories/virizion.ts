import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS, ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayerType } from '../../game/store/actions/play-card-action';

export class Virizion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Double Draw',
      cost: [G],
      damage: 0,
      text: 'Draw 2 cards.'
    },
    {
      name: 'Leaf Wallop',
      cost: [G, G, C],
      damage: 40,
      damageCalculation: '+',
      text: 'During your next turn, this Pokemon\'s Leaf Wallop attack does 40 more damage (before applying Weakness and Resistance).'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Virizion';
  public fullName: string = 'Virizion NVI';

  public readonly LEAF_WALLOP_MARKER = 'LEAF_WALLOP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 2);
    }

    // Leaf Wallop
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check if marker is already present for bonus damage
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          if (HAS_MARKER(this.LEAF_WALLOP_MARKER, cardList, this)) {
            effect.damage += 40;
          }
        }
      });

      // Add marker for next turn
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          ADD_MARKER(this.LEAF_WALLOP_MARKER, cardList, this);
        }
      });
    }

    // Remove marker at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Remove marker from opponent's Pokemon (this card)
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          REMOVE_MARKER(this.LEAF_WALLOP_MARKER, cardList, this);
        }
      });
    }

    return state;
  }
}
