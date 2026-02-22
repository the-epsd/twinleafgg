import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class NsVanillish extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'N\'s Vanillite';
  public tags = [CardTag.NS];
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Flop',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Sheer Cold',
    cost: [W, C, C],
    damage: 60,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t use attacks.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'N\'s Vanillish';
  public fullName: string = 'N\'s Vanillish M2a';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sheer Cold - prevent defending Pokemon from attacking during opponent's next turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    // Block attacks when marker is present
    if (effect instanceof UseAttackEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // Remove marker at end of turn
    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    return state;
  }
}



