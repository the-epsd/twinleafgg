import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Mimikyu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Filch',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Draw 2 cards.'
  }, {
    name: 'Copycat',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 0,
    copycatAttack: true,
    text: 'If your opponent\'s Pokémon used an attack that isn\'t a GX attack during their last turn, use it as this attack.'
  }];

  public set: string = 'GRI';

  public name: string = 'Mimikyu';

  public fullName: string = 'Mimikyu GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 2);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const lastAttack = state.lastAttack;

      if (!lastAttack || lastAttack.copycatAttack === true || lastAttack.gxAttack === true) {
        return state;
      }

      const attackEffect = new AttackEffect(player, opponent, lastAttack);
      store.reduceEffect(state, attackEffect);

      if (attackEffect.damage > 0) {
        const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
      }

      return state;
    }

    return state;
  }
}