import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
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
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
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
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
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
