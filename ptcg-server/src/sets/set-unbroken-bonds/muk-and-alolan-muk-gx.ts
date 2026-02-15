import { CardTag, CardType, PokemonCard, SpecialCondition, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class MukAlolanMukGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 270;
  public weakness = [{ type: P }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Severe Poison',
      cost: [P, C, C],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 8 damage counters instead of 1 on that Pokémon between turns.'
    },
    {
      name: 'Posion Absorption',
      cost: [P, C, C, C],
      damage: 120,
      text: 'If your opponent\'s Active Pokémon is Poisoned, heal 100 damage from this Pokémon.'
    },
    {
      name: 'Nasty Goo Mix-GX',
      cost: [],
      damage: 0,
      gxAttack: true,
      text: 'Your opponent\'s Active Pokémon is now Paralyzed and Poisoned. If this Pokémon has at least 4 extra Energy attached to it (in addition to this attack\'s cost), put 15 damage counters instead of 1 on that Pokémon between turns. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'UNB';
  public setNumber = '61';
  public cardImage = 'assets/cardback.png';
  public name = 'Muk & Alolan Muk-GX';
  public fullName = 'Umbreon & Darkrai-GX UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Severe Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this, 80);
    }

    // Poison Absorption
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      if (opponent.active.specialConditions.length > 0 && opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        const healing = new HealTargetEffect(effect, 100);
        healing.target = player.active;
        store.reduceEffect(state, healing);
      }
    }

    // Nasty Goo Mix-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, opponent, this);
      let poisonDamage = 10;

      const extraEffectCost: CardType[] = [C, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        poisonDamage = 150;
      }

      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this, poisonDamage);
    }

    return state;
  }
}