import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, SelectPrompt, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, DRAW_CARDS, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownF extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'FAKE',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if Unown F is on your Bench, you may use this power. Put a coin next to your Active Pokémon without showing your opponent and cover it with your hand. Your opponent guesses if the coin is heads or tails. If he or she is wrong, draw a card.',
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [P],
    damage: 10,
    text: 'You may flip a coin. If tails, this attack does nothing. If heads, this attack\'s base damage is 30.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Unown [F]';
  public fullName: string = 'Unown [F] GE';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // FAKE
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const isOnBench = player.bench.some(slot => slot.getPokemonCard() === this);
      if (!isOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new SelectPrompt(
        opponent.id,
        GameMessage.CHOOSE_OPTION,
        [GameMessage.HEADS, GameMessage.TAILS],
        { allowCancel: false }
      ), choice => {
        const guessedHeads = choice === 0;
        COIN_FLIP_PROMPT(store, state, player, actualHeads => {
          if (guessedHeads !== actualHeads) {
            DRAW_CARDS(store, state, player, 1);
          }
        });
      });
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, wantToFlip => {
        if (!wantToFlip) {
          return;
        }
        COIN_FLIP_PROMPT(store, state, effect.player, result => {
          if (result) {
            effect.damage = 30;
          } else {
            effect.damage = 0;
          }
        });
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    return state;
  }
}
