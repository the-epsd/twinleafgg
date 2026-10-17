import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Tentacruel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tentacool';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tentacle Strike',
    cost: [],
    damage: 0,
    text: 'Search your opponent\'s discard pile for up to 2 Energy cards and attach them to any of your opponent\'s Pokémon in any way you like. For each Energy card attached in this way, this attack does 20 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Dangerous Poison',
    cost: [W, C, C],
    damage: 60,
    text: 'If Tentacruel has less Energy attached to it than the Defending Pokémon, the Defending Pokémon is now Paralyzed and Poisoned.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Tentacruel';
  public fullName: string = 'Tentacruel LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tentacle Strike
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasEnergyInDiscard = opponent.discard.cards.some(c =>
        c.superType === SuperType.ENERGY,
      );
      if (!hasEnergyInDiscard) {
        return state;
      }
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        opponent.discard,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: 2 },
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, opponent, transfer.to);
          MOVE_CARDS(store, state, opponent.discard, target, {
            cards: [transfer.card],
            sourceCard: this,
            sourceEffect: this.attacks[0],
          });
          if (target === opponent.active) {
            const damageEffect = new DealDamageEffect(effect, 20);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          } else {
            const damageEffect = new PutDamageEffect(effect, 20);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          }
        }
      });
    }

    // Dangerous Poison
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const selfEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, selfEnergy);
      const selfCount = selfEnergy.energyMap.reduce((n, em) => n + em.provides.length, 0);
      const defCheck = new CheckProvidedEnergyEffect(player, effect.opponent.active);
      store.reduceEffect(state, defCheck);
      const defCount = defCheck.energyMap.reduce((n, em) => n + em.provides.length, 0);
      if (selfCount < defCount) {
        ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      }
    }

    return state;
  }
}
