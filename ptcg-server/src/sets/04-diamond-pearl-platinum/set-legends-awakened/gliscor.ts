import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { GameMessage, PokemonCardList, SelectPrompt, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { CONFIRMATION_PROMPT, MOVE_POKEMON_OFF_BOARD, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Gliscor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gligar';
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Burning Poison',
    cost: [],
    damage: 0,
    text: 'Choose either Burned or Poisoned. The Defending Pokémon is now affected by that Special Condition. You may return Gliscor and all cards attached to it to your hand.'
  },
  {
    name: 'Pester',
    cost: [F, C],
    damage: 40,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is affected by a Special Condition, this attack does 40 damage plus 40 more damage.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Gliscor';
  public fullName: string = 'Gliscor LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Burning Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const options: { message: GameMessage, value: SpecialCondition }[] = [
        { message: GameMessage.SPECIAL_CONDITION_BURNED, value: SpecialCondition.BURNED },
        { message: GameMessage.SPECIAL_CONDITION_POISONED, value: SpecialCondition.POISONED },
      ];
      store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_SPECIAL_CONDITION,
        options.map(c => c.message),
        { allowCancel: false },
      ), choice => {
        const option = options[choice];
        if (option !== undefined) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [option.value]);
          store.reduceEffect(state, specialConditionEffect);
        }
        CONFIRMATION_PROMPT(store, state, player, wantToReturn => {
          if (!wantToReturn) {
            return;
          }
          const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
          MOVE_POKEMON_OFF_BOARD(store, state, cardList, {
            pokemonDestination: player.hand,
            sourceCard: this,
          });
        }, GameMessage.WANT_TO_PICK_UP_POKEMON);
      });
    }

    // Pester
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.specialConditions.length > 0) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
