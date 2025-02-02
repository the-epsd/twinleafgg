import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';

export class Miltank extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Miracle Body',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon V.'
  }];

  public attacks = [{
    name: 'Rout',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 10,
    damageCalculator: '+',
    text: 'This attack does 20 more damage for each of your opponent\'s Benched Pokémon.'
  }];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '126';

  public name: string = 'Miltank';

  public fullName: string = 'Miltank ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Prevent damage from Pokemon V
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined) {
        return state;
      }

      // Do not ignore self-damage from Pokemon V
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (sourceCard.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VMAX || CardTag.POKEMON_VSTAR)) {

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

        effect.preventDefault = true;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      //Get number of benched pokemon
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = opponentBenched;

      effect.damage = 10 + totalBenched * 20;
    }
    return state;
  }
}