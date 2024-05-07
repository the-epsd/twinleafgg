import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage, PlayerType, PokemonCardList, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Metapod extends PokemonCard {

  public name = 'Metapod';
  
  public setNumber = '54';
  
  public set = 'BS';
  
  public fullName = 'Metapod BS';
  
  public cardType = CardType.GRASS;

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Caterpie';

  public hp = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Stiffen',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      text: 'Flip a coin. If heads, prevent all damage done to Metapod during your opponent\'s next turn. (Any other effects of attacks still happen.)',
      damage: 0
    },
    {
      name: 'Stun Spore',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (heads) {
          const player = effect.player;
          player.marker.addMarker(PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        }
      });
    }

    if (effect instanceof PutDamageEffect &&
        effect.target.marker.hasMarker(PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this)) {
      effect.player.marker.removeMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (heads) {
          const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, condition);
        }
      });
    }

    return state;
  }

}
