import { PokemonCard, Stage, CardType, StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Spritzee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Sweet Scent',
    cost: [C],
    damage: 0,
    text: 'Heal 30 damage from 1 of your Pokemon.'
  },
  {
    name: 'Ram',
    cost: [P],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Spritzee';
  public fullName: string = 'Spritzee M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sweet Scent - Heal 30 from 1 Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        const targets = selected || [];
        if (targets.length > 0) {
          const healEffect = new HealEffect(player, targets[0], 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
