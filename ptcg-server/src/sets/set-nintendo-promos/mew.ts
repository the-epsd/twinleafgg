import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StoreLike, State, PlayerType, ChoosePokemonPrompt, GameMessage, SlotType, GameError, GameStoreMessage, CardTarget } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Mew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Psywave',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the amount of Energy attached to the Defending Pokémon.'
  },
  {
    name: 'Devolution Beam',
    cost: [P],
    damage: 0,
    text: 'Flip a coin. If heads, choose 1 of either player\'s Evolved Pokémon, remove the highest stage Evolution card from that Pokémon, and put it into that player\'s hand.'
  }];

  public set: string = 'NP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Mew';
  public fullName: string = 'Mew NP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkProvidedEnergy);

      const damagePerEnergy = 10;
      effect.damage = checkProvidedEnergy.energyMap.length * damagePerEnergy;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          let canDevolve = false;
          const blocked: CardTarget[] = [];
          effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
            if (list.getPokemons().length > 1) {
              canDevolve = true;
            } else {
              blocked.push(target);
            }
          });
          effect.opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
            if (list.getPokemons().length > 1) {
              canDevolve = true;
            } else {
              blocked.push(target);
            }
          });

          if (!canDevolve) {
            return state;
          }

          return store.prompt(state, new ChoosePokemonPrompt(
            effect.player.id,
            GameMessage.CHOOSE_POKEMON,
            PlayerType.ANY,
            [SlotType.ACTIVE, SlotType.BENCH],
            { allowCancel: false, min: 1, max: 1, blocked }
          ),
            (results) => {
              if (results && results.length > 0) {
                const targetPokemon = results[0];
                const pokemons = targetPokemon.getPokemons();

                if (pokemons.length > 1) {
                  const highestStagePokemon = pokemons[pokemons.length - 1];
                  targetPokemon.moveCardsTo([highestStagePokemon], effect.player.hand);
                  targetPokemon.clearEffects();
                  targetPokemon.pokemonPlayedTurn = state.turn;
                } else {
                  throw new GameError(GameStoreMessage.INVALID_GAME_STATE);
                }
              }

              return state;
            }
          );
        }
      });
    }

    return state;
  }
}

