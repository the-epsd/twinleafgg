import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { GameError } from '../../game/game-error';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Fennekin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Will-O-Wisp',
    cost: [CardType.FIRE],
    damage: 10,
    text: ''
  },
  {
    name: 'Tail Whip',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'Fliip a coin. If heads, the Defending Pokemon can\'t attack during your opponent\'s next turn.'
  }
  ];

  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Fennekin';
  public fullName: string = 'Fennekin FCO';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
        }
      });
    }

    if (effect instanceof UseAttackEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    return state;
  }

}