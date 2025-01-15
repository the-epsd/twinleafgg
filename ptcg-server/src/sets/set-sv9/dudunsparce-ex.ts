import { PokemonCard, CardTag, Stage, CardType, State, StoreLike, StateUtils, PlayerType } from '../../game';
import { AfterDamageEffect, ApplyWeaknessEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Dudunsparceex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Dunsparce';
  public cardType: CardType = C;
  public hp: number = 270;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Adversity Tail',
    cost: [C],
    damage: 60,
    damageCalculation: 'x',
    text: 'This attack does 60 damage for each of your opponent\'s Pokemon ex in play.'
  },
  {
    name: 'Breaking Drill',
    cost: [C, C, C],
    damage: 150,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokemon.'
  }];

  public regulationMark = 'H';
  public set: string = 'SV9';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Dudunsparce ex';
  public fullName: string = 'Dudunsparce ex SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let opponentexPokemon = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.cardTag.includes(CardTag.POKEMON_ex)) {
          opponentexPokemon++;
        }
      });

      effect.damage = opponentexPokemon * 60;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const dealDamage = new DealDamageEffect(effect, 150);
      store.reduceEffect(state, dealDamage);

      const applyWeakness = new ApplyWeaknessEffect(effect, dealDamage.damage);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }

}