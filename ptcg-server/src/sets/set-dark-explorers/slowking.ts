import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Slowking extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slowpoke';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Psy Bolt',
      cost: [P],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
    },
    {
      name: 'Hand Press',
      cost: [P, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'If you have more cards in your hand than your opponent, this attack does 30 more damage.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slowking';
  public fullName: string = 'Slowking DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psy Bolt - flip coin for paralysis
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    // Hand Press - bonus damage if more cards in hand
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerHandSize = player.hand.cards.length;
      const opponentHandSize = opponent.hand.cards.length;

      if (playerHandSize > opponentHandSize) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
