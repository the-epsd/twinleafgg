import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK } from '../../game/store/prefabs/attack-effects';

export class Beheeyem extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Elgyem';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Psypunch',
      cost: [P],
      damage: 20,
      text: '',
    },
    {
      name: 'Mysterious Noise',
      cost: [C, C, C],
      damage: 90,
      text: 'Shuffle this Pokémon and all cards attached to it into your deck. Your opponent can\'t play any Item cards from their hand during their next turn.',
    }
  ];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Beheeyem';
  public fullName: string = 'Beheeyem UNM';

  public readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      ADD_MARKER(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, opponent, this);
      SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
    }

    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (HAS_MARKER(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    return state;
  }
}