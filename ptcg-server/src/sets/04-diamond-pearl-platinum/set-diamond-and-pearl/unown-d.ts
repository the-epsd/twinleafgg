import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { ConfirmPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, COIN_FLIP_PROMPT, DRAW_CARDS, HAS_MARKER, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownD extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'DRAW',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Unown D is on your Bench, you may flip a coin. If heads, each player may draw a card. (You draw your card first.)',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Unown [D]';
  public fullName: string = 'Unown [D] DP';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // DRAW
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const isOnBench = player.bench.some(cardList => cardList.getPokemonCard() === this);
      if (!isOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_DRAW_CARDS,
        ), playerDraws => {
          if (playerDraws) {
            DRAW_CARDS(store, state, player, 1);
          }

          store.prompt(state, new ConfirmPrompt(
            opponent.id,
            GameMessage.WANT_TO_DRAW_CARDS,
          ), opponentDraws => {
            if (opponentDraws) {
              DRAW_CARDS(store, state, opponent, 1);
            }
          });
        });
      });

      return state;
    }

    return state;
  }
}
