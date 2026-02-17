import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DEVOLVE_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class EspeonEX extends PokemonCard {

  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 170;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Miraculous Shine',
    cost: [C],
    damage: 0,
    text: 'Devolve each of your opponent\'s evolved Pokémon and put the highest Stage Evolution card on it into your opponent\'s hand.'
  }, {
    name: 'Psyshock',
    cost: [P, C, C],
    damage: 70,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Espeon-EX';
  public fullName: string = 'Espeon-EX BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Miraculous Shine
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard()) {
        const activePokemon = opponent.active.getPokemons();
        if (activePokemon.length > 0) {
          DEVOLVE_POKEMON(store, state, opponent.active, opponent.hand);
        }
      }


      opponent.bench.forEach(benchSpot => {
        if (benchSpot.getPokemonCard()) {
          const benchPokemon = benchSpot.getPokemons();
          if (benchPokemon.length > 0) {
            DEVOLVE_POKEMON(store, state, benchSpot, opponent.hand);
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 70);
    }

    return state;
  }
}