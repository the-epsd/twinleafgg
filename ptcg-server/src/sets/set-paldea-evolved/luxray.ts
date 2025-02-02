import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GET_PLAYER_PRIZES, PLAY_POKEMON_FROM_HAND_TO_BENCH, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';


export class Luxray extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Luxio';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Swelling Flash',
    powerType: PowerType.ABILITY,
    useFromHand: true,
    text: 'Once during your turn, if this Pokémon is in your hand and you have more Prize cards remaining than your opponent, you may put this Pokémon onto your Bench.'
  }];

  public attacks = [{

    name: 'Wild Charge',
    cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
    damage: 180,
    text: 'This Pokémon also does 20 damage to itself.'
  }];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Luxray';

  public fullName: string = 'Luxray PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (GET_PLAYER_PRIZES(player).length <= GET_PLAYER_PRIZES(opponent).length)
        throw new GameError(GameMessage.CANNOT_USE_POWER);

      PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this))
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);

    return state;
  }
}