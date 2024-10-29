import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Butterfree extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public evolvesFrom = 'Metapod';

  public attacks = [{
    name: 'Whirlwind',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
  },
  {
    name: 'Mega Drain',
    cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.GRASS],
    damage: 40,
    text: 'Remove a number of damage counters from Butterfree equal to half the damage done to the Defending Pokémon (after applying Weakness and Resistance) (rounded up to the nearest 10).'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '33';

  public name: string = 'Butterfree';

  public fullName: string = 'Butterfree JU';

  public USED_WHIRLWIND: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.USED_WHIRLWIND = true;
    }

    if (effect instanceof AfterDamageEffect && this.USED_WHIRLWIND) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          opponent.active.clearEffects();
          opponent.switchPokemon(targets[0]);
          return state;
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      this.USED_WHIRLWIND = false;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const target = player.active;

      const damageEffect = new DealDamageEffect(effect, 40);
      damageEffect.target = effect.target;

      state = store.reduceEffect(state, damageEffect);


      const damageToHeal = damageEffect.damage / 2;

      // rounding to nearest 10
      const damageToHealLow = (damageToHeal / 10) * 10;
      const damageToHealHigh = damageToHealLow + 10;
      const heal = (damageToHeal - damageToHealLow >= damageToHealHigh - damageToHeal) ? damageToHealHigh : damageToHealLow;

      // Heal damage
      const healEffect = new HealEffect(player, target, heal);
      state = store.reduceEffect(state, healEffect);
      return state;

    }

    return state;
  }

}