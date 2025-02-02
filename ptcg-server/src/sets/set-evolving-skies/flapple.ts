import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Flapple extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 80;

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Acidic Mucus',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage for each of your opponent\'s Pokémon in play that has an Ability.'
    },
    {
      name: 'Fighting Tackle',
      cost: [CardType.GRASS, CardType.FIRE],
      damage: 80,
      text: 'If your opponent\'s Active Pokémon is a Pokémon V, this attack does 80 more damage.'
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public name: string = 'Flapple';

  public fullName: string = 'Flapple EVS';

  public evolvesFrom = 'Applin';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let benchPokemon: PokemonCard[] = [];
      const pokemonWithAbilities: PokemonCard[] = [];
      const opponentActive = opponent.active.getPokemonCard();

      const stubPowerEffectForActive = new PowerEffect(opponent, {
        name: 'test',
        powerType: PowerType.ABILITY,
        text: ''
      }, opponent.active.getPokemonCard()!);

      try {
        store.reduceEffect(state, stubPowerEffectForActive);

        if (opponentActive && opponentActive.powers.length) {
          pokemonWithAbilities.push(opponentActive);
        }
      } catch {
        // no abilities in active
      }

      if (opponent.bench.some(b => b.cards.length > 0)) {
        const stubPowerEffectForBench = new PowerEffect(opponent, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, opponent.bench.filter(b => b.cards.length > 0)[0].getPokemonCard()!);

        try {
          store.reduceEffect(state, stubPowerEffectForBench);

          benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
          pokemonWithAbilities.push(...benchPokemon.filter(card => card.powers.length));
        } catch {
          // no abilities on bench
        }
      }

      const abilities = pokemonWithAbilities.length;
      effect.damage += abilities * 50;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard() &&
        (opponent.active.getPokemonCard()!.tags.includes(CardTag.POKEMON_V) ||
          opponent.active.getPokemonCard()!.tags.includes(CardTag.POKEMON_VMAX) ||
          opponent.active.getPokemonCard()!.tags.includes(CardTag.POKEMON_VSTAR))) {
        effect.damage += 80;
      }

      return state;
    }

    return state;
  }

}
