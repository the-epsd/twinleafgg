import { GameMessage, PokemonCard, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, ADD_MARKER, CONFIRMATION_PROMPT, DEVOLVE_POKEMON, HAS_MARKER, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, REMOVE_MARKER_AT_END_OF_TURN, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Omastar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Omanyte';
  public hp: number = 110;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: +30 }];
  public retreat = [C];

  public powers = [{
    name: 'Primal Swirl',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Omastar from your hand to evolve 1 of your Pokémon, you may remove the highest Stage Evolution card from each of your opponent\'s Benched Evolved Pokémon and put those cards back into his or her hand. You can\'t use more than 1 Primal Swirl Poké-Power each turn.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Send Back',
    cost: [W, C],
    damage: 40,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Omastar';
  public fullName: string = 'Omastar MD';

  public readonly PRIMAL_SWIRL_MARKER = 'PRIMAL_SWIRL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.PRIMAL_SWIRL_MARKER, this);

    // Primal Swirl
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.PRIMAL_SWIRL_MARKER, player)) {
        return state;
      }

      const hasEvolvedBenched = opponent.bench.some(b => b.getPokemons().length > 1);
      if (!hasEvolvedBenched) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        ADD_MARKER(this.PRIMAL_SWIRL_MARKER, player, this);

        opponent.bench.forEach(benchPokemon => {
          if (benchPokemon.getPokemons().length > 1) {
            DEVOLVE_POKEMON(store, state, benchPokemon, opponent.hand);
          }
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Send Back
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (!effect.opponent.bench.some(b => b.cards.length > 0)) {
        return state;
      }
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.opponent);
    }

    return state;
  }
}
