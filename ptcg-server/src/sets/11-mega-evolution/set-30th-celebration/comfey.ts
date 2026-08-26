import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Comfey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = P;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Comforting Aroma',
    cost: [C],
    damage: 0,
    text: 'Heal 80 damage from 1 of your Benched Pokémon.'
  },
  {
    name: 'Magical Shot',
    cost: [P],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Comfey';
  public fullName: string = 'Comfey 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Comforting Aroma
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          const healEffect = new HealEffect(player, targets[0], 80);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
