import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';  
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage, PlayerType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Kakuna extends PokemonCard {

  public name = 'Kakuna';
  
  public set = 'BS';
  
  public fullName = 'Kakuna BS';

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Weedle';

  public evolvesInto = 'Beedrill';
  
  public cardType = CardType.GRASS;

  public hp = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  
  public readonly STIFFEN_MARKER = 'STIFFEN_MARKER';
  
  public readonly CLEAR_STIFFEN_MARKER = 'CLEAR_STIFFEN_MARKER';

  public attacks: Attack[] = [
    {
      name: 'Stiffen',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      text: 'Flip a coin. If heads, prevent all damage done to Kakuna during your opponent’s next turn. (Any other effects of attacks still happen.)',
      damage: 0
    },
    {
      name: 'Poisonpowder',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (heads) {
          const player = effect.player
          player.marker.addMarker(this.STIFFEN_MARKER, this);
        }
      });
    }
    
    if (effect instanceof PutDamageEffect && 
        effect.target.marker.hasMarker(this.STIFFEN_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_STIFFEN_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_STIFFEN_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.STIFFEN_MARKER, this);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (heads) {
          const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, condition);
        }
      });
    }

    return state;
  }

}
