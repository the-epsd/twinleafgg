import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Cubchoo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Sniffle',
      cost: [W],
      damage: 0,
      text: 'During your next turn, this Pokémon\'s Belt attack\'s base damage is 40.'
    },
    {
      name: 'Belt',
      cost: [W, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cubchoo';
  public fullName: string = 'Cubchoo NXD';

  public readonly SNIFFLE_MARKER = 'SNIFFLE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sniffle - add marker for boosted Belt next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          ADD_MARKER(this.SNIFFLE_MARKER, cardList, this);
        }
      });
    }

    // Belt - check for marker to boost damage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this && HAS_MARKER(this.SNIFFLE_MARKER, cardList, this)) {
          effect.damage = 40;
          REMOVE_MARKER(this.SNIFFLE_MARKER, cardList, this);
        }
      });
    }

    // Remove marker at end of opponent's turn (so it lasts "during your next turn")
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Clean up YOUR markers when OPPONENT's turn ends
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          REMOVE_MARKER(this.SNIFFLE_MARKER, cardList, this);
        }
      });
    }

    return state;
  }
}
