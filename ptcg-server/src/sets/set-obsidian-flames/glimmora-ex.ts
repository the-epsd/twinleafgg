import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayerType, PowerType, StateUtils } from '../../game';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Glimmoraex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Glimmet';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 270;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [
    {
      name: 'Dust Field',
      powerType: PowerType.ABILITY,
      text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t have more than 3 Benched Pokémon. If they have 4 or more Benched Pokémon, they discard Benched Pokémon until they have 3 Pokémon on the Bench. If more than one effect changes the number of Benched Pokémon allowed, use the smaller number.'
    }];

  public attacks = [{
    name: 'Poisonous Gem',
    cost: [F, F],
    damage: 140,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'OBF';
  public name: string = 'Glimmora ex';
  public fullName: string = 'Glimmora ex OBF';
  public setNumber: string = '123';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dust Field
    if (effect instanceof CheckTableStateEffect) {
      effect.benchSizes = state.players.map((player, index) => {
        // gotta check the ability
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return 5;
        }

        // checking if glimmora is the opponent's active
        let isGlimmoraInPlay = false;
        const opponent = StateUtils.getOpponent(state, player);
        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          const pokemon = cardList.getPokemonCard();
          if (!!pokemon && cardList === opponent.active && pokemon.name === 'Glimmora ex' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
            isGlimmoraInPlay = true;
          }
        });

        // if glim is the opponent's active, reduce the bench size
        if (isGlimmoraInPlay) {
          return 3;
        }
        // if glim isn't the opponent's active, skip everything
        else {
          return 5;
        }
      });
    }

    // Poisonous Gem
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;

      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
    }

    return state;
  }
}