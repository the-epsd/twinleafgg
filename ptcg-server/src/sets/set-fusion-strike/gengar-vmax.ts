import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GengarVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public tags = [CardTag.POKEMON_VMAX];
  public evolvesFrom = 'Gengar V';
  public cardType: CardType = D;
  public hp: number = 320;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Fear and Panic',
    cost: [D, D],
    damage: 60,
    text: 'This attack does 60 damage for each of your opponent\'s Pokémon V and Pokémon-GX in play.'
  },
  {
    name: 'G-Max Swallow Up',
    cost: [D, D, D],
    damage: 250,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'FST';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public name: string = 'Gengar VMAX';

  public fullName: string = 'Gengar VMAX FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const vPokemons = opponent.bench.filter(card => card instanceof PokemonCard && card.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX || CardTag.POKEMON_GX));
      const vPokemons2 = opponent.active.getPokemons().filter(card => card.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX || CardTag.POKEMON_GX));

      const vPokes = vPokemons.length + vPokemons2.length;
      const damage = 60 * vPokes;

      effect.damage = damage;

    }

    // G-Max Swallow Up
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
