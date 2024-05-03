import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AbstractAttackEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage, PlayerType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Raichu extends PokemonCard {

  public name = 'Raichu';
  
  public set = 'BS';
  
  public fullName = 'Raichu BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';
  
  public stage: Stage = Stage.STAGE_1;
  
  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat: CardType[] = [CardType.COLORLESS];

  public readonly CLEAR_AGILITY_MARKER = 'CLEAR_AGILITY_MARKER';

  public readonly AGILITY_MARKER = 'AGILITY_MARKER';
  
  public attacks: Attack[] = [
    {
      name: 'Agility',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'Flip a coin. If heads, during your opponent’s next turn, prevent all effects of attacks, including damage, done to Raichu.'
    },
    {
      name: 'Thunder',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 60,
      text: 'Flip a coin. If tails, Raichu does 30 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.COIN_FLIP
      ), (flipResult) => {
        if (flipResult) {
          player.active.marker.addMarker(this.AGILITY_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_AGILITY_MARKER, this);
        }
      });
      
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.COIN_FLIP
      ), (flipResult) => {
        if (!flipResult) {
          const damageEffect = new DealDamageEffect(effect, 30);
          damageEffect.target = effect.player.active;
          store.reduceEffect(state, damageEffect);
        }
      });

    }
    
    if (effect instanceof EndTurnEffect && 
        effect.player.marker.hasMarker(this.CLEAR_AGILITY_MARKER, this)) {
        
      effect.player.marker.removeMarker(this.CLEAR_AGILITY_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.AGILITY_MARKER, this);
      });
    }
    
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this) && 
        effect.target.marker.hasMarker(this.AGILITY_MARKER, this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();
  
      if (pokemonCard !== this) {
        return state;
      }
  
      if (sourceCard) {  
        effect.preventDefault = true;
      }
      
      return state;
    }


    return state;

  }

}