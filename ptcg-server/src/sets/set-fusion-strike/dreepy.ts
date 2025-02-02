import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Dreepy extends PokemonCard {

  public tags = [ CardTag.FUSION_STRIKE ];

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [ {type: CardType.FIGHTING, value: -30} ];

  public retreat = [ CardType.COLORLESS ];

  public attacks = 
    [
      {
        name: 'Infestation',
        cost: [ CardType.PSYCHIC ],
        damage: 10,
        text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
      }
    ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public name: string = 'Dreepy';

  public fullName: string = 'Dreepy FST';

  public readonly INFESTATION_MARKER = 'INFESTATION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.INFESTATION_MARKER, this);
    }
  
    if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(this.INFESTATION_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }
  
    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.INFESTATION_MARKER, this);
    }
    return state;
  }
}