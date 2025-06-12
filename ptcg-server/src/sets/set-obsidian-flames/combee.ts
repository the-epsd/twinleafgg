import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Combee extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Share',
      cost: [G],
      damage: 0,
      text: 'Heal 20 damage from 1 of your Benched Pokémon.'
    },
    {
      name: 'Ram',
      cost: [G, G],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Combee';
  public fullName: string = 'Combee OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new HealTargetEffect(effect, 40);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}