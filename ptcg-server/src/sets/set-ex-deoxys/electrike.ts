import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Electrike extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'High Voltage',
    cost: [L],
    damage: 0,
    text: 'Flip a coin. If heads, your opponent can\'t play Trainer cards from his or her hand during his or her next turn.',
  },
  {
    name: 'Gnaw',
    cost: [C, C],
    damage: 20,
    text: '',
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Electrike';
  public fullName: string = 'Electrike DX';

  public readonly OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_MARKER(this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER, opponent, this);
        }
      });
    }

    if (effect instanceof TrainerEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER, this);
    }
    return state;
  }
}