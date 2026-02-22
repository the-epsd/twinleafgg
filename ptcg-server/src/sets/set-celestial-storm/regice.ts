import { PokemonCard, } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike, SpecialCondition } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Regice extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 120;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Icy Barrier',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Stadium cards from their hand.'
  }];

  public attacks = [
    {
      name: 'Icy Wind',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    }
  ];

  public set: string = 'CES';

  public name: string = 'Regice';

  public fullName: string = 'Regice CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '45';


  public readonly OPPONENT_CANNOT_PLAY_STADIUMS_MARKER = 'OPPONENT_CANNOT_PLAY_STADIUMS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      state = store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof PlayStadiumEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (opponent.active.getPokemonCard() == this) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }
    return state;
  }
}