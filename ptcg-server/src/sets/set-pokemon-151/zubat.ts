import { PokemonCard, Stage, StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SHOW_CARDS_TO_PLAYER, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Zubat extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = D;
  public hp = 40;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Revealing Echo',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may have your opponent reveal their hand.'
  }];

  public attacks = [{
    name: 'Bite',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set = 'MEW';
  public regulationMark = 'G';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Zubat';
  public fullName = 'Zubat MEW';

  public readonly REVEALING_ECHO_MARKER = 'REVEALING_ECHO_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (opponent.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (HAS_MARKER(this.REVEALING_ECHO_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);

      ADD_MARKER(this.REVEALING_ECHO_MARKER, player, this);
      ABILITY_USED(player, this);
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.REVEALING_ECHO_MARKER, this);

    return state;
  }

}
