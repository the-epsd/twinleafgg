import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { GameError, GameMessage, PlayerType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Houndstoneex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Greavard';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 260;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Big Bite',
      cost: [P],
      damage: 30,
      text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
    },
    {
      name: 'Last Respects',
      cost: [P, C, C],
      damage: 160,
      damageCalculation: '+',
      text: 'This attack does 10 more damage for each [P] Pokémon in your discard pile.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Houndstone ex';
  public fullName: string = 'Houndstone ex OBF';

  public readonly CANT_RETREAT_MARKER = 'CANT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Big Bite
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.CANT_RETREAT_MARKER, this);
      opponent.marker.addMarker(this.CANT_RETREAT_MARKER, this);
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.CANT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CANT_RETREAT_MARKER, this)) {
      effect.player.marker.removeMarker(this.CANT_RETREAT_MARKER, this);
      
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.marker.hasMarker(this.CANT_RETREAT_MARKER, this)){
          cardList.marker.removeMarker(this.CANT_RETREAT_MARKER, this);
        }
      });
    }
    
    // Last Respects
    if (WAS_ATTACK_USED(effect, 1, this)){
      const player = effect.player;

      let psychicsInDiscard = 0;
      player.discard.cards.forEach(card => { if (card instanceof PokemonCard && card.cardType === P){ psychicsInDiscard++; } });

      effect.damage += psychicsInDiscard * 10;
    }

    return state;
  }

}
