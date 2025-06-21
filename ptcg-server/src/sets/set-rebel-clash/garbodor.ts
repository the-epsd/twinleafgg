import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType, StoreLike, State, StateUtils, GameError } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { GameMessage } from '../../game/game-message';
import { ABILITY_USED, ADD_MARKER, ADD_POISON_TO_PLAYER_ACTIVE, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Garbodor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Trubbish';
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Poisonous Puddle',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if a Stadium is in play, you may make your opponent\'s Active Pokémon Poisoned.'
  }];

  public attacks = [{
    name: 'Sludge Bomb',
    cost: [D, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'RCL';
  public regulationMark = 'D';
  public name: string = 'Garbodor';
  public fullName: string = 'Garbodor RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '118';

  public readonly POISON_STRUCTURE_MARKER = 'POISON_STRUCTURE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (HAS_MARKER(this.POISON_STRUCTURE_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (opponent.active) {
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
      }

      ADD_MARKER(this.POISON_STRUCTURE_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.POISON_STRUCTURE_MARKER, player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.POISON_STRUCTURE_MARKER, this);

    return state;
  }

}