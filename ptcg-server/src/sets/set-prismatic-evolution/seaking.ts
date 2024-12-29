import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard, PowerType, State, StateUtils, StoreLike } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Seaking extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Goldeen';

  public cardType: CardType = W;

  public hp: number = 110;

  public weakness = [{ type: L }];

  public retreat = [C];

  public canAttackTwice: boolean = false;

  public powers = [{
    name: 'Festival Lead',
    powerType: PowerType.ABILITY,
    text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Rapid Draw',
      cost: [C],
      damage: 60,
      text: 'Draw 2 cards.'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SV8a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';

  public name: string = 'Seaking';

  public fullName: string = 'Seaking SV8a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const stadiumCard = StateUtils.getStadiumCard(state);

      player.deck.moveTo(player.hand, 2);

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
