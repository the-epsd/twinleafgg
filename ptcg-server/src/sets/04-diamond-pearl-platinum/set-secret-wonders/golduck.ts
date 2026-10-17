import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { OPPONENTS_POKEMON_CAN_ONLY_USE_THAT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Golduck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Psyduck';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Encore',
    cost: [P],
    damage: 20,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can use only that attack during your opponent\'s next turn.'
  },
  {
    name: 'Break Beam',
    cost: [W, P],
    damage: 40,
    damageCalculation: '+',
    text: 'You may do 40 damage plus 20 more damage. If you do, Golduck is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Golduck';
  public fullName: string = 'Golduck SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Encore
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CAN_ONLY_USE_THAT_ATTACK(store, state, effect, this);
    }

    // Break Beam
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_DEAL_MORE_DAMAGE
      ), wantTo => {
        if (wantTo) {
          effect.damage += 20;
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
        }
      });
    }

    return state;
  }
}
