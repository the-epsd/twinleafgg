import { CoinFlipPrompt, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Butterfree extends PokemonCard {

  public regulationMark = 'I';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Metapod';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Scale Hurricane',
      cost: [CardType.GRASS],
      damage: 60,
      damageCalculation: '+',
      text: 'Flip 4 coins. This attack does 60 damage for each heads. If at least 2 of them are heads, your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public set: string = 'JTG';

  public name: string = 'Butterfree';

  public fullName: string = 'Butterfree JTG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 60 * heads;

        if (heads >= 2) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
      return state;
    }
    return state;
  }
}