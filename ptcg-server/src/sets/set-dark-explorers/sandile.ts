import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StateUtils } from '../../game/store/state-utils';

export class Sandile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Sand Dive',
      cost: [C],
      damage: 0,
      text: 'Flip a coin. If heads, prevent all damage done to this Pokemon by attacks during your opponent\'s next turn.'
    },
    {
      name: 'Corkscrew Punch',
      cost: [D, C, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sandile';
  public fullName: string = 'Sandile DEX';

  public readonly SAND_DIVE_MARKER = 'SAND_DIVE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sand Dive - flip coin, if heads prevent damage next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
            if (cardList.getPokemonCard() === this) {
              ADD_MARKER(this.SAND_DIVE_MARKER, cardList, this);
            }
          });
        }
      });
    }

    // Block damage if marker is present
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      if (HAS_MARKER(this.SAND_DIVE_MARKER, effect.target, this)) {
        effect.damage = 0;
      }
    }

    // Remove marker at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          REMOVE_MARKER(this.SAND_DIVE_MARKER, cardList, this);
        }
      });
    }

    return state;
  }
}
