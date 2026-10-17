import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, PlayerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Orthwormex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_ex];
  public hp: number = 220;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Pummeling Payback',
    powerType: PowerType.ABILITY,
    text: "If this Pokémon is damaged by an attack from your opponent's Pokémon(even if this Pokémon is Knocked Out), put 2 damage counters on the Attacking Pokémon for each [M] Energy attached to this Pokémon.",
  }];

  public attacks = [{
    name: 'Rock Tomb',
    cost: [C, C, C, C],
    damage: 150,
    text: "During your opponent's next turn, the Defending Pokémon can't retreat.",
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Orthworm ex';
  public fullName: string = 'Orthworm ex SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pummeling Payback
    if (effect instanceof PutDamageEffect || effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      let isOrthwormexInPlay = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isOrthwormexInPlay = true;
        }
      });

      if (!isOrthwormexInPlay) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(targetPlayer, effect.target);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach((em) => {
        energyCount += em.provides.filter(
          (cardType) => cardType === CardType.METAL || cardType === CardType.ANY,
        ).length;
      });

      if (energyCount > 0) {
        store.reduceEffect(
          state,
          new PlaceDamageCountersEffect(
            targetPlayer,
            player.active,
            energyCount * 10,
            this,
            this.powers[0],
          ),
        );
      }
    }

    // Rock Tomb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
