import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, PLAY_POKEMON_FROM_HAND_TO_BENCH, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Klinklang extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Klang';
  public cardType: CardType = M;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Emergency Rotation',
    powerType: PowerType.ABILITY,
    useFromHand: true,
    text: 'Once during your turn, if this Pokémon is in your hand and your opponent has any Stage 2 Pokémon in play, ' +
      'you may put this Pokémon onto your Bench.'
  }];

  public attacks = [
    {
      name: 'Hyper Ray',
      cost: [C, C],
      damage: 130,
      text: 'Discard all Energy from this Pokémon.'
    }
  ];

  public set: string = 'SCR';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Klinklang';
  public fullName: string = 'Klinklang SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponentStage2InPlay = StateUtils.getOpponent(state, player)
        .getPokemonInPlay().filter(c => c.getPokemonCard()?.stage === Stage.STAGE_2);

      if (opponentStage2InPlay.length === 0)
        throw new GameError(GameMessage.CANNOT_USE_POWER);

      PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this))
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);

    return state;
  }
}