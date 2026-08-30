import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENTS_POKEMON_CAN_ONLY_USE_THAT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';

export class Whimsicott2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cottonee';
  public cardType: CardType[] = [G];
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Encore',
    cost: [C],
    damage: 20,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. During your opponent\'s next turn, that Pokémon can only use that attack.'
  },
  {
    name: 'U-turn',
    cost: [G, G],
    damage: 40,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Whimsicott';
  public fullName: string = 'Whimsicott EPO 12';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Encore
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CAN_ONLY_USE_THAT_ATTACK(store, state, effect, this);
    }
    // U-turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench) {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), targets => {
          const target = targets[0];
          player.switchPokemon(target);
        });
      }
    }

    return state;
  }
}
