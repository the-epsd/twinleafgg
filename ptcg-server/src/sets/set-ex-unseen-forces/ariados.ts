import { Attack, CardType, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, ADD_SLEEP_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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

  public usedSpiderTrap: boolean = false;

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
      this.usedSpiderTrap = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSpiderTrap) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const bench = opponent.bench.filter(bench => bench.cards.length > 0);

      if (bench.length === 0) {
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
        this.usedSpiderTrap = false;
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
          this.usedSpiderTrap = false;
          return state;
        } else {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];
            opponent.switchPokemon(cardList);
            ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
            ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
            this.usedSpiderTrap = false;
          });
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    return state;
  }
}