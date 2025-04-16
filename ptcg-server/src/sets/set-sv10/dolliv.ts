import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {StoreLike,State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {HealTargetEffect} from '../../game/store/effects/attack-effects';

export class Dolliv extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Smoliv';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Nutrients',
      cost: [G],
      damage: 0,
      text: 'Heal 40 damage from 1 of your Pokémon.'
    },
    {
      name: 'Tackle',
      cost: [C, C],
      damage: 40,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dolliv';
  public fullName: string = 'Dolliv SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nutrients
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
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
