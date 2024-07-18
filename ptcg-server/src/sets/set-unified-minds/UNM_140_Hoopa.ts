import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Hoopa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Evil Admonition',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: 'This attack does 20 more damage for each of your opponent\'s Pokémon that has an Ability.'
  },
  {
    name: 'Mind Shock',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '140';
  public name = 'Hoopa';
  public fullName = 'Hoopa UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
      const vPokemons = benchPokemon.filter(card => card.powers.length);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.powers.length) {
        vPokemons.push(opponentActive);
      }
      const vPokes = vPokemons.length;
      effect.damage += vPokes * 20;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }

    return state;
  }
}