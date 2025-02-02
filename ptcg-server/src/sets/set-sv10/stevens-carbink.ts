import { PokemonCard, PowerType, StateUtils } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class StevensCarbink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: CardTag[] = [CardTag.STEVENS];
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Stone Palace',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on the Bench, each of your Steven\'s Pokémon takes 30 less damage ' +
      'from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). ' +
      'The effect of Stone Palace doesn\'t stack.'
  }]

  public attacks = [{ name: 'Magical Shot', cost: [P, C, C], damage: 80, text: '' }];

  public regulationMark: string = 'I';
  public set: string = 'SVOD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Steven\'s Carbink';
  public fullName: string = 'Steven\'s Carbink SVOD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      if (effect.damageReduced || state.phase != GamePhase.ATTACK)
        return state;

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let isBenched = false;

      opponent.bench.forEach(benchPokemon => {
        if (benchPokemon.getPokemonCard() === this)
          isBenched = true;
      });

      if (!isBenched)
        return state;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(opponent, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (effect.target.getPokemonCard()?.tags.includes(CardTag.STEVENS)) {
        effect.damage = Math.max(0, effect.damage - 30);
        effect.damageReduced = true;
      }
      return state;
    }


    return state;
  }

}
