import { CardTag, CardType, PokemonCard, PokemonCardList, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class ReshiramCharizardGX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public cardType: CardType = R;
  public hp: number = 270;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Outrage',
    cost: [R, C],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each damage counter on this Pokemon.'
  },
  {
    name: 'Flare Strike',
    cost: [R, R, R, C],
    damage: 230,
    text: 'This Pokemon can\'t use Flare Strike during your next turn.'
  },
  {
    name: 'Double Blaze-GX',
    cost: [R, R, R],
    damage: 200,
    shredAttack: false,
    gxAttack: true,
    damageCalculation: '+',
    text: 'If this Pokemon has at least 3 extra [R] Energy attached to it (in addition to this attack\'s cost), ' +
      'this attack does 100 more damage, and this attack\'s damage isn\'t affected by any effects on your ' +
      'opponent\'s Active Pokemon. (You can\'t use more than 1 GX attack in a game.)'
  },];

  public set = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name = 'Reshiram & Charizard-GX';
  public fullName = 'Reshiram & Charizard-GX UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Outrage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const cardList = StateUtils.findCardList(state, this);
      if (!(cardList instanceof PokemonCardList)) { return state; }
      effect.damage += cardList.damage;
    }

    // Flare Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Flare Strike')) {
        player.active.cannotUseAttacksNextTurnPending.push('Flare Strike');
      }
    }

    // Double Blaze-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const extraEffectCost: CardType[] = [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        this.attacks[0].shredAttack === true;
        const applyWeakness = new ApplyWeaknessEffect(effect, effect.damage + 100);
        store.reduceEffect(state, applyWeakness);
        const damage = applyWeakness.damage;

        effect.damage = 0;

        if (damage > 0) {
          opponent.active.damage += damage;
          const afterDamage = new AfterDamageEffect(effect, damage);
          state = store.reduceEffect(state, afterDamage);
        }
      }
    }

    return state;
  }
}