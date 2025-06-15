import { GameError, GameMessage, PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, MULTIPLE_COIN_FLIPS_PROMPT, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Dragonite extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dragonair';
  public cardType: CardType = C;
  public hp: number = 100;
  public retreat = [C, C];

  public powers = [{
    name: 'Tailwind',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Dragonite is on your Bench, you may reduce your Active Pokémon\'s Retreat Cost to 0.'
  }];

  public attacks = [{
    name: 'Dragon Tail',
    cost: [L, W, F],
    damage: 40,
    damageCalculationn: 'x',
    text: 'Flip 2 coins. This attack does 40 damage times the number of heads.'
  }];

  public set: string = 'EX';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dragonite';
  public fullName: string = 'Dragonite EX';

  public readonly TAILWIND_MARKER = 'TAILWIND_MARKER';
  public readonly TAILWIND_USED_MARKER = 'TAILWIND_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (HAS_MARKER(this.TAILWIND_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (effect.card === player.active.getPokemonCard()) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.TAILWIND_MARKER, player.active, this);

      ADD_MARKER(this.TAILWIND_USED_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.TAILWIND_MARKER, this);
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.TAILWIND_USED_MARKER, this);

    if (effect instanceof CheckRetreatCostEffect && HAS_MARKER(this.TAILWIND_MARKER, effect.player.active, this)) {
      effect.cost = [];
    }

    // Dragon Tail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 40 * heads;
      });
    }

    return state;
  }
}