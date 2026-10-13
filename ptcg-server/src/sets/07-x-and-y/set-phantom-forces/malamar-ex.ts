import { CardTag, CardType, SpecialCondition, Stage, SuperType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { PowerType, StateUtils, StoreLike, State } from '../../../game';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class MalamarEx extends PokemonCard {
  protected _tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public hp: number = 170;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Hyper Hypnosis',
    powerType: PowerType.ABILITY,
    text: "When you attach an Energy from your hand to this Pokémon, you may use this Ability. Your opponent's Active Pokémon is now Asleep.",
  }];

  public attacks = [{
    name: 'MAXamar',
    cost: [D, C],
    damage: 60,
    damageCalculation: 'x',
    text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 60 damage times the number of heads.'
  }];

  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Malamar-EX';
  public fullName: string = 'Malamar-EX PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hyper Hypnosis
    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        opponent.active,
        [SpecialCondition.ASLEEP],
      );
    }

    // MAXamar
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energyCount = player.active.cards.filter(
        (c) => c.superType === SuperType.ENERGY,
      ).length;

      if (energyCount === 0) {
        effect.damage = 0;
        return state;
      }

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, (results) => {
        const heads = results.filter((r) => r).length;
        effect.damage = 60 * heads;
      });
    }

    return state;
  }
}
