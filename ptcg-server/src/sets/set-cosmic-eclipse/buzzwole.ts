import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';

export class Buzzwole extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ULTRA_BEAST];
  public cardType: CardType = CardType.GRASS;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Beast Boost',
    powerType: PowerType.ABILITY,
    text: 'This Pokemon\'s attacks do 20 more damage to your opponent\'s Active Pokemon for each Prize card you have taken (before applying Weakness and Resistance'
  }];

  public attacks = [{
    name: 'Touchdown',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 60,
    text: 'Heal 30 damage from this Pokémon'
  }];

  public set = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name = 'Buzzwole';
  public fullName = 'Buzzwole CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target === StateUtils.getOpponent(state, effect.player).active) {
      const player = effect.player;
      const prizesTaken = 6 - player.getPrizeLeft();

      console.log('Current Damage Boost: ' + (20 * prizesTaken));

      if (player.active.getPokemonCard() === this) {
        effect.damage += (20 * prizesTaken);

        console.log('Current Damage: ' + effect.damage);
      }

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const target = player.active;
      const healEffect = new HealEffect(player, target, 30);
      state = store.reduceEffect(state, healEffect);
      return state;
    }

    return state;
  }
}