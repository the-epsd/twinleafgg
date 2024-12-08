import { CardTag, CardType, GameError, GameMessage, PokemonCard, PokemonCardList, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';


export class ReshiramCharizardGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 270;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Outrage',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: 30,
      text: 'This attack does 10 more damage for each damage counter on this Pokemon.'
    },
    {
      name: 'Flare Strike',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 230,
      text: 'This Pokemon can\'t use Flare Strike during your next turn.'
    },
    {
      name: 'Double Blaze-GX',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: 200,
      shred: false,
      gxAttack: true,
      text: 'If this Pokemon has at least 3 extra R Energy attached to it (in addition to this attack\'s cost), ' +
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
    if (effect instanceof EndTurnEffect) {
      const marker = effect.player.marker;
      marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      if (marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        marker.removeMarker(this.ATTACK_USED_MARKER, this);
        marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      }
    }

    // Double Blaze-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = effect.opponent;

      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      player.usedGX = true;

      const extraEffectCost: CardType[] = [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        this.attacks[0].shred === true;
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