import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameError, GameMessage } from '../../game';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Farfetchd extends PokemonCard {
  
  public name = 'Farfetch\'d';
  
  public set = 'BS';
  
  public fullName = 'Farfetch\'d BS';

  public stage = Stage.BASIC;

  public hp = 50;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '27';

  public cardType = CardType.COLORLESS;
  
  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];
  
  public readonly LEEK_SLAP_MARKER = 'LEEK_SLAP_MARKER';

  public attacks: Attack[] = [
    {
      name: 'Leek Slap',
      cost: [CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing. Either way, you can’t use this attack again as long as Farfetch’d stays in play (even putting Farfetch’d on the Bench won’t let you use it again).'
    },
    {
      name: 'Pot Smash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.LEEK_SLAP_MARKER, this);
    }      

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      if (effect.player.attackMarker.hasMarker(this.LEEK_SLAP_MARKER, this)) {
        throw new GameError(GameMessage.LEEK_SLAP_CANNOT_BE_USED_AGAIN);
      }
      
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], (heads) => {
        if (!heads) {
          effect.damage = 0;
        }
        
        effect.player.attackMarker.addMarker(this.LEEK_SLAP_MARKER, this);
        
        return state;
      });
    }
    
    return state;
  }
}
