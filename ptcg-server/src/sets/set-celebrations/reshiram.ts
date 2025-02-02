import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Reshiram extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 130;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Scorching Wind',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'This attack does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Black Flame',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 80,
    text: 'If Zekrom is on your Bench, this attack does 80 more damage.'
  }];

  public set: string = 'CEL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Reshiram';
  public fullName: string = 'Reshiram CEL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });

      return state;

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const zekrom = player.bench.some(c => c.getPokemonCard()?.name === 'Zekrom');

      if (zekrom) {
        effect.damage += 80;
      }
    }

    return state;
  }
}