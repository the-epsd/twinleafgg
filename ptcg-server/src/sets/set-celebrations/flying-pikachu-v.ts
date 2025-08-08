import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { AbstractAttackEffect, AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, PREVENT_DAMAGE, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';


export class FlyingPikachuV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = L;
  public hp: number = 190;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Thunder Shock',
    cost: [L],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }, {
    name: 'Fly',
    cost: [C, C, C],
    damage: 120,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public regulationMark = 'E';
  public set: string = 'CEL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Flying Pikachu V';
  public fullName: string = 'Flying Pikachu V CEL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {

        if (flipResult) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        } else {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const sourceCard = effect.source.getPokemonCard();

      if (sourceCard && opponent.active.marker.hasMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);

    return state;
  }
}