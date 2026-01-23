import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StateUtils } from '../../game/store/state-utils';

export class Dwebble extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Withdraw',
      cost: [C],
      damage: 0,
      text: 'Flip a coin. If heads, prevent all damage done to this Pokemon by attacks during your opponent\'s next turn.'
    },
    {
      name: 'Slash',
      cost: [G, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dwebble';
  public fullName: string = 'Dwebble NVI';

  public readonly WITHDRAW_MARKER = 'WITHDRAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Withdraw - flip coin, if heads prevent damage next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
            if (cardList.getPokemonCard() === this) {
              ADD_MARKER(this.WITHDRAW_MARKER, cardList, this);
            }
          });
        }
      });
    }

    // Block damage if marker is present
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      if (HAS_MARKER(this.WITHDRAW_MARKER, effect.target, this)) {
        effect.damage = 0;
      }
    }

    // Remove marker at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          REMOVE_MARKER(this.WITHDRAW_MARKER, cardList, this);
        }
      });
    }

    return state;
  }
}
