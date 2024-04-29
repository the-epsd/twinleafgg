import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { StoreLike, State, StateUtils, GameMessage, PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Chansey extends PokemonCard {
  
  public set: string = 'BS';

  public fullName = 'Chansey BS';
  
  public name = 'Chansey';
  
  public cardType: CardType = CardType.COLORLESS;  

  public stage: Stage = Stage.BASIC;
  
  public hp: number = 120;

  public weakness = [{ type: CardType.LIGHTNING }];
  
  public resistance = [{ type: CardType.PSYCHIC, value: 30 }];

  public retreat = [CardType.COLORLESS];
  
  public readonly CLEAR_SCRUNCH_MARKER = 'CLEAR_SCRUNCH_MARKER';

  public readonly SCRUNCH_MARKER = 'SCRUNCH_MARKER';

  public attacks = [
    {
      name: 'Scrunch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Flip a coin. If heads, prevent all damage done to Chansey during your opponent’s next turn. (Any other effects of attacks still happen.)'
    },
    {
      name: 'Double-edge',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: 'Chansey does 80 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.SCRUNCH_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_SCRUNCH_MARKER, this);
        }
      });
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.SCRUNCH_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_SCRUNCH_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_SCRUNCH_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.SCRUNCH_MARKER, this);
      });
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
          
      const dealDamage = new DealDamageEffect(effect, 80);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }

}