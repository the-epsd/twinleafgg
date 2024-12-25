import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, StateUtils, SpecialCondition } from '../../game';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class BlackKyuremex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 230;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Ice Age',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'If your opponent\'s Active Pokémon is a [N] Pokémon, it is now Paralyzed.'
  },
  {
    name: 'Black Frost',
    cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    damage: 250,
    text: 'This Pokémon also does 30 damage to itself.'
  },];

  public set: string = 'SSP';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Black Kyurem ex';
  public fullName: string = 'Black Kyurem ex SV7a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.cardType === CardType.DRAGON) {
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
        store.reduceEffect(state, specialConditionEffect);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}
