import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils } from '../../game';
import { AbstractAttackEffect, ApplyWeaknessEffect, PutDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';


export class Skeledirge extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Crocalor';
  public cardType: CardType = CardType.FIRE;
  public hp: number = 180;
  public weakness = [{ type: CardType.WATER }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Unaware',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks from your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)'
  }];

  public attacks = [{
    name: 'Flare Recital',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 60,
    text: 'This attack does 20 more damage for each Benched Pokémon (both yours and your opponent\'s).'
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Skeledirge';
  public fullName: string = 'Skeledirge SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = playerBenched + opponentBenched;

      effect.damage = 60 + totalBenched * 20;
    }

    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (sourceCard) {
        // if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const player = StateUtils.findOwner(state, effect.target);
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof DealDamageEffect) {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    return state;
  }

}
