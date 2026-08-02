import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, StateUtils } from "../../../game";
import { DealDamageEffect } from "../../../game/store/effects/attack-effects";
import { CheckHpEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED, THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from "../../../game/store/prefabs/prefabs";

export class Scizorex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Scyther';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Danger Perception',
    powerType: PowerType.POKEBODY,
    text: 'As long as Scizor ex\'s remaining HP is 60 or less, Scizor ex does 40 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Steel Wing',
    cost: [M, C],
    damage: 40,
    text: 'During your opponent\'s next turn, any damage done to Scizor ex by attacks is reduced by 20 (after applying Weakness and Resistance).'
  },
  {
    name: 'Cross-Cut',
    cost: [C, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 50 damage plus 30 more damage.'
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '108';
  public name: string = 'Scizor ex';
  public fullName: string = 'Scizor ex UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) { return state; }

      const checkHpEffect = new CheckHpEffect(player, effect.source);
      store.reduceEffect(state, checkHpEffect);

      const attack = effect.attack;
      if (attack && attack.damage > 0 && effect.target === opponent.active && checkHpEffect.hp <= 60) {
        console.log(effect.source.hp, effect.source.damage);
        effect.damage += 40;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 20);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemons().length > 1) {
        effect.damage += 30;
      }
    }

    return state;
  }
}