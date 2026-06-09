import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PokemonCardList, StoreLike, State, StateUtils } from '../../game';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cherubi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 40;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C];
  public attacks = [{
    name: 'Hide',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage and effects done to this Pokémon by attacks.'
  },
  {
    name: 'Flop',
    cost: [G],
    damage: 10,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = 'MF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Cherubi';
  public fullName: string = 'Cherubi MF';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-x-and-y-promos/jirachi.ts (Stardust — prevent all damage and effects next turn)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          player.active.marker.addMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
          opponent.marker.addMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
        }
      });
    }
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this)) {
      effect.player.marker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
      });
    }
    if (effect instanceof AbstractAttackEffect
      && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this
      && effect.target.marker.hasMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this)
      && effect.source.getPokemonCard()) {
      effect.preventDefault = true;
    }
    return state;
  }
}
