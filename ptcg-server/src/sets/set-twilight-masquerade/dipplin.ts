import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard, PowerType, State, StateUtils, StoreLike } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Dipplin extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Applin';

  public regulationMark = 'H';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public canAttackTwice: boolean = false;

  public powers = [{
    name: 'Festival Lead',
    powerType: PowerType.ABILITY,
    text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Do the Wave',
      cost: [CardType.GRASS],
      damage: 20,
      text: 'This attack does 20 damage for each of your Benched Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '18';

  public name: string = 'Dipplin';

  public fullName: string = 'Dipplin TWM 18';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activePokemon = opponent.active.getPokemonCard();
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (activePokemon) {
        const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
        effect.damage = playerBenched * 20;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      // Check if 'Festival Plaza' stadium is in play
      if (stadiumCard && stadiumCard.name === 'Festival Grounds') {
        this.canAttackTwice = true;
      } else {
        this.canAttackTwice = false;
      }

      // Increment attacksThisTurn
      player.active.attacksThisTurn = (player.active.attacksThisTurn || 0) + 1;

    }
    return state;
  }
}
