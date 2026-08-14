import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Sableye extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public resistance = [{ type: C, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Night Vision',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Sableye is your Active Pokémon, you may look at your opponent\'s hand. This power can\'t be used if Sableye is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Slash',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Limitation',
    cost: [D],
    damage: 0,
    text: 'Your opponent can\'t play any Supporter Cards from his or hand during your opponent\'s next turn.'
  }];

  public set = 'DX';
  public setNumber = '23';
  public cardImage = 'assets/cardback.png';
  public name = 'Sableye';
  public fullName = 'Sableye DX';

  public readonly NIGHT_VISION_MARKER = 'NIGHT_VISION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.NIGHT_VISION_MARKER, effect.player, this);
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.NIGHT_VISION_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (HAS_MARKER(this.NIGHT_VISION_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      if (player.active.cards[0] !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
      ADD_MARKER(this.NIGHT_VISION_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    // Limitation
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS(store, state, effect, this);
    }
    return state;
  }
}
