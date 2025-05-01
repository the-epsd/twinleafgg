import { Attack, CardTag, CardType, PlayerType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Jolteonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -30 }];
  public retreat = [];

  public powers: Power[] = [
    {
      name: 'Evolutionary Thunder',
      powerType: PowerType.POKEPOWER,
      text: 'Once during your turn, when you play Jolteon ex from your hand to evolve 1 of your Pokémon, you may put 1 damage counter on each of your opponent\'s Pokémon.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Second Bite',
      cost: [L, C],
      damage: 20,
      damageCalculation: '+',
      text: 'Does 20 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
    },
    {
      name: 'Thunder Blast',
      cost: [L, C],
      damage: 70,
      text: 'Discard a [L] Energy card attached to Jolteon ex.'
    },
  ];

  public set: string = 'DS';
  public setNumber: string = '109';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jolteon ex';
  public fullName: string = 'Jolteon ex DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          const opponent = StateUtils.getOpponent(state, effect.player);
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
            const effectOfAbility = new EffectOfAbilityEffect(effect.player, this.powers[0], this, cardList);
            effectOfAbility.target = cardList;
            store.reduceEffect(state, effectOfAbility);
            if (effectOfAbility.target) {
              cardList.damage += 10;
            }
          });
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage += effect.opponent.active.damage;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, L);
    }

    return state;
  }
}