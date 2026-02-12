import { PokemonCard, Stage, CardType, StoreLike, State, PlayerType, ChoosePokemonPrompt, GameMessage, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grimer';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Sludge Drag',
    cost: [P],
    damage: 0,
    text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. The new Defending Pokémon is now Confused and Poisoned.'
  },
  {
    name: 'Pester',
    cost: [P, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is affected by a Special Condition, this attack does 50 damage plus 30 more damage.'
  }];

  public set: string = 'UD';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Muk';
  public fullName: string = 'Muk UD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];

        opponent.switchPokemon(cardList);
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.specialConditions.length > 0) {
        effect.damage += 30;
      }
    }

    return state;
  }
} 