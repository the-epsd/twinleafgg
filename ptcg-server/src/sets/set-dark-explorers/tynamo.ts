import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tynamo extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = L;

  public hp: number = 40;

  public weakness = [{ type: F }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Spark',
      cost: [L],
      damage: 10,
      text: 'Does 10 damage to 1 of your opponent\'s Benched Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Tynamo';

  public fullName: string = 'Tynamo DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '45';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }

}
