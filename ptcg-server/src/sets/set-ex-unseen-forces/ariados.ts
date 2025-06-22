import { Attack, CardType, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';
import { CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ariados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Spinarak';
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness: Weakness[] = [{ type: P }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Reactive Poison',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'Does 10 damage plus 30 more damage for each Special Condition affecting the Defending Pokémon.'
  },
  {
    name: 'Spider Trap',
    cost: [G],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep and Poisoned. Before applying this effect, you may switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. If you do, the new Defending Pokémon is now Asleep and Poisoned. Your opponent chooses the Defending Pokémon to switch.'
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Ariados';
  public fullName: string = 'Ariados UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const oppActive = opponent.active;

      oppActive.specialConditions.forEach(c => {
        effect.damage += 30;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const bench = opponent.bench.filter(bench => bench.cards.length > 0);

      if (bench.length === 0) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];
            opponent.switchPokemon(cardList);
            YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
            YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
          });
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    return state;
  }
}