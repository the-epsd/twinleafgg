import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Gallade extends PokemonCard {

  public regulationMark = 'E';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kirlia';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 170;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Feint',
      cost: [CardType.PSYCHIC],
      damage: 60,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    },
    {
      name: 'Dynablade',
      cost: [C, C],
      damage: 60,
      text: 'This attack does 60 damage for each of your opponent\'s Pokémon V in play.'
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '81';

  public name: string = 'Gallade';

  public fullName: string = 'Gallade CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      effect.ignoreResistance = true;

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
      const vPokemons = benchPokemon.filter(card => card.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX));
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX || CardTag.POKEMON_ex)) {
        vPokemons.push(opponentActive);
      }

      effect.ignoreResistance = false;
      effect.ignoreWeakness = false;

      let vPokes = vPokemons.length;

      if (opponentActive) {
        vPokes++;
      }

      effect.damage *= vPokes;

    }

    return state;
  }



}