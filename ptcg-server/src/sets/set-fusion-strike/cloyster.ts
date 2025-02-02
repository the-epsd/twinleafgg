import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Cloyster extends PokemonCard {
  public regulationMark = 'E';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shellder';
  public cardType: CardType = CardType.WATER;
  public hp: number = 130;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Shell Armor',
    powerType: PowerType.ABILITY,
    text: 'This Pokemon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Aqua Split',
    cost: [CardType.WATER, CardType.COLORLESS],
    damage: 120,
    damageCalculation: '+',
    text: 'This attack also does 30 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Cloyster';
  public fullName: string = 'Cloyster FST';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 30);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const min = Math.min(2, benched);
      const max = Math.min(2, benched);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min, max, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });

        return state;
      });
    }


    return state;
  }
}