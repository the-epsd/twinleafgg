import { CardType, GameError, GameMessage, PokemonCard, PokemonCardList, Stage, State, StateUtils, StoreLike } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class BeedrillTEU extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kakuna';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public set = 'TEU';

  public setNumber = '5';

  public cardImage = 'assets/cardback.png';

  public name = 'Beedrill';

  public fullName = 'Beedrill TEU';

  public attacks = [
    {
      name: 'Destiny Stinger',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'You can use this attack only if this Pokemon has any damage counters on it. Both Active Pokemon are Knocked Out.'
    },
    {
      name: 'Reckless Charge',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      text: 'This Pokemon does 10 damage to itself.'
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Destiny Stinger
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      // If no damage counters on ourself, can't use the attack.
      if (cardList.damage <= 0) { throw new GameError(GameMessage.BLOCKED_BY_EFFECT); }

      // Knock out both active Pokemon, the dumb way.
      player.active.damage += 999;
      opponent.active.damage += 999;
    }

    // Reckless Charge
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}