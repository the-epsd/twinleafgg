import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike, Weakness } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ninetales extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Vulpix';
  public cardType: CardType[] = [R];
  public hp: number = 90;
  public weakness: Weakness[] = [{ type: W }];
  public retreat: CardType[] = [C];

  public powers: Power[] = [{
    name: 'Bright Look',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, ' +
      'you may switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.',
  }];

  public attacks: Attack[] = [{
    name: 'Hexed Flame',
    cost: [R],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 50 more damage for each Special Condition affecting the Defending Pokémon.'
  }];

  public set: string = 'DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Ninetales';
  public fullName: string = 'Ninetales DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, (wantToUse) => {
        if (!wantToUse) {
          return;
        }
        GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
          store,
          state,
          player,
          this.powers[0],
          this,
        );
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const oppActive = opponent.active;

      oppActive.specialConditions.forEach(c => {
        effect.damage += 50;
      });
    }

    return state;
  }
}
