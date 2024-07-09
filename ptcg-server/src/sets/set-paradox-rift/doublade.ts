import { GameError, GameMessage, PokemonCardList, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Doublade extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.METAL;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];
  
  public resistance = [{ type: CardType.GRASS, value: -30 }];  

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  
  public evolvesFrom: string = 'Honedge';

  public attacks = [{
    name: 'Slash',
    cost: [ CardType.COLORLESS ],
    damage: 20,
    text: ''
  }, {
    name: 'Slashing Strike',
    cost: [ CardType.METAL, CardType.COLORLESS ],
    damage: 80,
    text: ''
  }];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '132';

  public name: string = 'Doublade';

  public fullName: string = 'Doublade PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect && effect.player.active.attackMarker.hasMarker(PokemonCardList.ATTACK_USED_2_MARKER, this)) {
      effect.player.active.attackMarker.removeMarker(PokemonCardList.ATTACK_USED_MARKER, this);
      effect.player.active.attackMarker.removeMarker(PokemonCardList.ATTACK_USED_2_MARKER, this);
    }
  
    if (effect instanceof EndTurnEffect && effect.player.active.attackMarker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
      effect.player.active.attackMarker.addMarker(PokemonCardList.ATTACK_USED_2_MARKER, this);
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // Check marker
      if (effect.player.active.attackMarker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      
      effect.player.active.attackMarker.addMarker(PokemonCardList.ATTACK_USED_MARKER, this);
    }
    
    return state;
  }
}