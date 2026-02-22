import { CardTag, CardType, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { AbstractAttackEffect, AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class KeldeoGX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX];
  public cardType: CardType = W;
  public hp: number = 170;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Pure Heart',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks, including damage, done to this Pokemon ' +
      'by your opponent\'s Pokemon-GX or Pokemon-EX.'
  }];

  public attacks = [
    {
      name: 'Sonic Edge',
      cost: [W, W, C],
      damage: 110,
      shredAttack: true,
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokemon.'
    },
    {
      name: 'Resolute Blade-GX',
      cost: [W, W, C],
      damage: 0,
      text: 'This attack does 50 damage for each of your opponent\'s Benched Pokemon. ' +
        '(You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'UNM';
  public setNumber = '47';
  public cardImage = 'assets/cardback.png';
  public name = 'Keldeo-GX';
  public fullName = 'Keldeo-GX UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pure Heart: Prevent damage & effects from Pokemon-EX
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();
      if (pokemonCard !== this) { return state; }

      if (sourceCard &&
        (sourceCard.tags.includes(CardTag.POKEMON_EX) ||
          sourceCard.tags.includes(CardTag.POKEMON_GX))) {
        try {
          const player = StateUtils.findOwner(state, effect.target);
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    // Sonic Edge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 110);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
      return state;
    }

    // Resolute Blade-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;
      let benchCount = 0;
      opponent.bench.forEach(b => benchCount += b.cards.length > 0 ? 1 : 0);
      effect.damage = 50 * benchCount;
    }

    return state;
  }
}