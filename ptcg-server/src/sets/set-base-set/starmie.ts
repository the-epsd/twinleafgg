import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';
import { GameMessage } from '../../game';

export class Starmie extends PokemonCard {

  public name = 'Starmie';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public setNumber = '64';

  public cardType = CardType.WATER;

  public fullName = 'Starmie';

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Staryu';

  public hp = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Recover',
      cost: [CardType.WATER, CardType.WATER],
      text: 'Discard 1 {W} Energy card attached to Starmie in order to use this attack. Remove all damage counters from Starmie.',
      damage: 0
    },
    {
      name: 'Star Freeze',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.WATER, 1);
      const player = effect.player;
      const heal = new HealEffect(player, player.active, player.active.damage);
      heal.target = effect.player.active;
      store.reduceEffect(state, heal);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (heads) {
          const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, condition);
        }
      });
    }

    return state;
  }

}
