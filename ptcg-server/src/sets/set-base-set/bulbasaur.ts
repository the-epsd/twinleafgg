import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StateUtils } from '../../game';

export class Bulbasaur extends PokemonCard {

  public name = 'Bulbasaur';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public fullName = 'Bulbasaur BS';

  public setNumber = '44';

  public cardType = CardType.GRASS;

  public stage = Stage.BASIC;

  public hp = 40;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Leech Seed',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: 20,
      text: 'Unless all damage from this attack is prevented, you may remove 1 damage counter from Bulbasaur.'
    }
  ];

  private attackedThisTurn = false;
  private opponentsStartingHp = 0;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.attackedThisTurn = true;
      this.opponentsStartingHp = StateUtils.getOpponent(state, effect.player).active.hp;
    }

    if (effect instanceof EndTurnEffect && effect.player.active.cards.includes(this) && this.attackedThisTurn) {
      this.attackedThisTurn = false;

      const opponent = StateUtils.getOpponent(state, effect.player);

      if (opponent.active.hp < this.opponentsStartingHp) {
        const healEffect = new HealEffect(effect.player, opponent.active, 10);
        store.reduceEffect(state, healEffect);
      }
    }

    return state;
  }

}
