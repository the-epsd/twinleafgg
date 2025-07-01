import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { GameError, GameMessage, PokemonCardList } from '../../game';
import { ABILITY_USED, ADD_SLEEP_TO_PLAYER_ACTIVE, BLOCK_IF_HAS_SPECIAL_CONDITION, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Bellossom extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Gloom';
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Hustle Step',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may remove 1 damage counter from each of your Pokémon. This power can\'t be used if Bellossom is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Dance \'til Dawn',
    cost: [G, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 30 damage times the number of heads. Bellossom is now Asleep.'
  }];

  public set: string = 'UD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Bellossom';
  public fullName: string = 'Bellossom UD';

  public readonly HUSTLE_STEP_MARKER = 'HUSTLE_STEP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.HUSTLE_STEP_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      player.marker.addMarker(this.HUSTLE_STEP_MARKER, this);
      ABILITY_USED(player, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        const healEffect = new HealEffect(player, cardList, 10);
        state = store.reduceEffect(state, healEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });

        effect.damage = 30 * heads;
      });
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    return state;
  }
}