import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage } from '../../game';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import {
  FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class Raichu extends PokemonCard {

  public name = 'Raichu';

  public set = 'BS';

  public fullName = 'Raichu BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Pikachu';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat: CardType[] = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Agility',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Raichu.'
    },
    {
      name: 'Thunder',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 60,
      text: 'Flip a coin. If tails, Raichu does 30 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.COIN_FLIP
      ), (flipResult) => {
        if (!flipResult) {
          const damageEffect = new DealDamageEffect(effect, 30);
          damageEffect.target = effect.player.active;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }

}
