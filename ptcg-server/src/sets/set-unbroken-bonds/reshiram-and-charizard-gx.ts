import { CardTag, CardType, GameError, GameMessage, PokemonCard, PokemonCardList, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class ReshiramCharizardGX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public cardType: CardType = R;
  public hp: number = 270;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
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
    },
  ];

  public set = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name = 'Reshiram & Charizard-GX';
  public fullName = 'Reshiram & Charizard-GX UNB';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Outrage
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const cardList = StateUtils.findCardList(state, this);
      if (!(cardList instanceof PokemonCardList)) { return state; }
      effect.damage += cardList.damage;
    }

    // Flare Strike
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const marker = effect.player.marker;
      if (marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      marker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    // Flare Strike -- Some silly-looking code to handle the attack next turn logic
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    // Double Blaze-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
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