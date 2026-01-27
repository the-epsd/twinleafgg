import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Basculin2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Tackle',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Splatter',
      cost: [W, C],
      damage: 0,
      text: 'Does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Basculin';
  public fullName: string = 'Basculin EPO 25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        const target = targets[0];
        const putDamage = new PutDamageEffect(effect, 30);
        putDamage.target = target;
        store.reduceEffect(state, putDamage);
      });
    }
    return state;
  }
}
