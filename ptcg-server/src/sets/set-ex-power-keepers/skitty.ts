import { GameError, State, StoreLike } from '../../game';
import { GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Skitty extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Tail Whip',
      cost: [C],
      damage: 0,
      text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack during your opponent\'s next turn.'
    },
    {
      name: 'Tackle',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'PK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '62';
  public name: string = 'Skitty';
  public fullName: string = 'Skitty PK';

  public readonly TAIL_WHIP_MARKER = 'TAIL_WHIP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          ADD_MARKER(this.TAIL_WHIP_MARKER, opponent.active, this);
        }
      });
    }

    if (effect instanceof UseAttackEffect && HAS_MARKER(this.TAIL_WHIP_MARKER, effect.player.active, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      REMOVE_MARKER(this.TAIL_WHIP_MARKER, effect.player.active, this);
    }

    return state;
  }

}
