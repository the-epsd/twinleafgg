import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slakoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Claw',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: 'Flip a coin. If tails, this attack does nothing. '
  },
  {
    name: 'Slack Off',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'Heal all damage from this Pokémon. It can\'t attack during your next turn.'
  }];

  public set: string = 'CES';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slakoth';
  public fullName: string = 'Slakoth CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
      ], heads => {
        if (heads) {
          effect.damage = 0;
        }
      });
    }

    // Slack Off
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;

      const healEffect = new HealEffect(player, player.active, player.active.damage);
      state = store.reduceEffect(state, healEffect);
    }

    return state;
  }
}