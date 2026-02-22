import { CardType, Stage } from '../../game/store/card/card-types';
import { Attack, PokemonCard, Power, PowerType, State, StateUtils, StoreLike } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dipplin extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Applin';
  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers: Power[] = [{
    name: 'Festival Lead',
    powerType: PowerType.ABILITY,
    text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks: Attack[] = [{
    name: 'Do the Wave',
    cost: [CardType.GRASS],
    damage: 20,
    barrage: false,
    text: 'This attack does 20 damage for each of your Benched Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public setNumber: string = '18';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dipplin';
  public fullName: string = 'Dipplin TWM1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle the Do the Wave attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activePokemon = opponent.active.getPokemonCard();

      if (activePokemon) {
        const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
        effect.damage = playerBenched * 20;
      }

      if (!IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        // Dynamically set barrage if Festival Grounds is in play
        const stadiumCard = StateUtils.getStadiumCard(state);
        if (stadiumCard && stadiumCard.name === 'Festival Grounds') {
          this.attacks[0].barrage = true;
        } else {
          this.attacks[0].barrage = false;
        }
      }
    }
    return state;
  }
}
