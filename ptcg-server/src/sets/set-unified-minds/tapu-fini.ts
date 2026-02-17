import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State, StateUtils } from '../../game';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

export class TapuFini extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Razor Fin',
      cost: [W],
      damage: 20,
      text: ''
    },
    {
      name: 'Nature Wave',
      cost: [W, W, C],
      damage: 100,
      text: 'If your opponent has any Ultra Beasts in play, this attack can be used for Colorless.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tapu Fini';
  public fullName: string = 'Tapu Fini UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 2: Nature Wave - reduce cost to [C] if opponent has Ultra Beasts
    // Ref: set-team-up/tentacruel.ts (Ultra Beast tag check)
    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasUltraBeast = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.ULTRA_BEAST)) {
          hasUltraBeast = true;
        }
      });

      if (hasUltraBeast) {
        effect.cost = [CardType.COLORLESS];
      }
    }

    return state;
  }
}
