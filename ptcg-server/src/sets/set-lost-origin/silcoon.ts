import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GameError, StateUtils } from '../../game';

export class Silcoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 80;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Wurmple';

  public attacks = [{
    name: 'Entangling String',
    cost: [CardType.GRASS],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, the Defending Pokémon can\'t attack.'
  },
  {
    name: 'Ram',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 20,
    text: ''
  }
  ];

  public regulationMark: string = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Silcoon';
  public fullName: string = 'Silcoon LOR';

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
