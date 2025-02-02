import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class ZacianV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Piercing Strike',
      cost: [CardType.METAL],
      damage: 40,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on your opponent\'s Active Pokémon.'
    },
    {
      name: 'Behemoth Blade',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 100,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is a Pokémon VMAX, this attack does 160 more damage.'
    },
  ];

  public set: string = 'CRZ';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Zacian V';

  public fullName: string = 'Zacian V CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const damage = 40;  // Fixed damage without weakness/resistance
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_VMAX)) {
        effect.damage += 160;
      }
    }
    return state;
  }
}