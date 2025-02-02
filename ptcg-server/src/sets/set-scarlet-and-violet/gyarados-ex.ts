import { PokemonCard, Stage, CardType, State, StoreLike, CardTag, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Gyaradosex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magikarp';

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public cardType = CardType.WATER;

  public hp = 300;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Waterfall',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: 100,
      text: ''
    },
    {
      name: 'Tyrannical Tail',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 180,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 180 more damage.'
    },
  ];

  public set: string = 'SVI';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '45';

  public name: string = 'Gyarados ex';

  public fullName: string = 'Gyarados ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.damage > 0) {
        effect.damage += 180;
      }
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}