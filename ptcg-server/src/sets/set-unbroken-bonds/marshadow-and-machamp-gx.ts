import { CardTag, CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';


export class MarshadowMachampGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 270;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Revenge',
      cost: [F, C],
      damage: 30,
      damageCalculation: '+',
      text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s attack during their last turn, this attack does 90 more damage.'
    },
    {
      name: 'Hundred-Blows Impact',
      cost: [F, F, C],
      damage: 160,
      text: ''
    },
    {
      name: 'Acme of Heroism-GX',
      cost: [F, F, C],
      damage: 200,
      gxAttack: true,
      text: 'If this Pokémon has at least 1 extra Energy attached to it (in addition to this attack\'s cost), and if it would be Knocked Out by damage from an opponent\'s attack during their next turn, it is not Knocked Out, and its remaining HP becomes 10. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'UNB';
  public setNumber = '82';
  public cardImage = 'assets/cardback.png';
  public name = 'Marshadow & Machamp-GX';
  public fullName = 'Marshadow & Machamp-GX UNB';

  public readonly ACME_OF_HEROSIM_MARKER = 'ACME_OF_HEROSIM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Revenge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) { effect.damage += 90; }
    }

    // Acme of Heroism-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const extraEffectCost: CardType[] = [F, F, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        player.active.marker.addMarker(this.ACME_OF_HEROSIM_MARKER, this);
      }
    }

    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this && effect.target.marker.hasMarker(this.ACME_OF_HEROSIM_MARKER, this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.damage >= checkHpEffect.hp) {
        effect.preventDefault = true;
        effect.target.damage = checkHpEffect.hp - 10;
      }
    }

    return state;
  }
}