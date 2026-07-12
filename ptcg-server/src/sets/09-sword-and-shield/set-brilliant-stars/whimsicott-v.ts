import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, PlayerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';

export class WhimsicottV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = P;
  public hp: number = 190;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Fluff Gets in the Way',
    cost: [P],
    damage: 20,
    text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
  },
  {
    name: 'Cotton Guard',
    cost: [P, C, C],
    damage: 90,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Whimsicott V';
  public fullName: string = 'Whimsicott V BRS';
  public regulationMark = 'F';

  public readonly COTTON_GUARD_MARKER = 'COTTON_GUARD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      if (opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        opponent.active.marker.addMarker(this.COTTON_GUARD_MARKER, this);
        opponent.marker.addMarker(this.COTTON_GUARD_MARKER, this);
      }
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.COTTON_GUARD_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.COTTON_GUARD_MARKER, this)) {
      effect.player.marker.removeMarker(this.COTTON_GUARD_MARKER, this);
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.marker.hasMarker(this.COTTON_GUARD_MARKER, this)) {
          cardList.marker.removeMarker(this.COTTON_GUARD_MARKER, this);
        }
      });
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    return state;
  }
}
