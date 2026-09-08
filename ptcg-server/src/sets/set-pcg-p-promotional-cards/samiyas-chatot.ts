import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils,
  Player
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../game/store/prefabs/copy-attack-prefabs';

export class SamiyasChatot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 50;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Copy',
    cost: [C],
    damage: 0,
    copycatAttack: true,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. Copy copies that attack. This attack does nothing if this Pokémon doesn\'t have the Energy necessary to use that attack. (You must still do anything else required for that attack.) This Pokémon performs that attack.'
  }];

  public set: string = 'PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '143';
  public name: string = 'Samiya\'s Chatot';
  public fullName: string = 'Samiya\'s Chatot PCGP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();

      if (!opponentActive) {
        return state;
      }

      const { blocked } = this.buildEnergyBlockedAttacks(state, store, player, opponentActive);

      return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect as AttackEffect, [opponentActive], {
        allowCancel: true,
        blocked,
      });
    }
    return state;
  }

  private buildEnergyBlockedAttacks(
    state: State,
    store: StoreLike,
    player: Player,
    card: PokemonCard,
  ): { blocked: { index: number; attack: string }[] } {
    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const blocked: { index: number; attack: string }[] = [];
    const affordableAttacks = card.attacks.filter(attack => {
      const checkAttackCost = new CheckAttackCostEffect(player, attack);
      state = store.reduceEffect(state, checkAttackCost);
      return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost as CardType[]);
    });
    card.attacks.forEach(attack => {
      if (!affordableAttacks.includes(attack)) {
        blocked.push({ index: 0, attack: attack.name });
      }
    });

    return { blocked };
  }
}
