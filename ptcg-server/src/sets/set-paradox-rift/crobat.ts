import { GameError, SelectPrompt, State, StateUtils, StoreLike } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Crobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public regulationMark: string = 'G';
  public cardType: CardType = CardType.DARK;
  public hp: number = 130;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [];
  public evolvesFrom = 'Golbat';

  public attacks = [{
    name: 'Echoing Madness',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: 'Choose Item cards or Supporter cards. During your opponent\'s next turn, they can\'t play any of the chosen cards from their hand.'
  }, {
    name: 'Cutting Wind',
    cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 130,
    text: ''
  }];

  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Crobat';
  public fullName: string = 'Crobat PAR';

  public ECHOING_MADNESS_ITEM_LOCK_MARKER = 'ECHOING_MADNESS_ITEM_LOCK_MARKER';
  public ECHOING_MADNESS_SUPPORTER_LOCK_MARKER = 'ECHOING_MADNESS_SUPPORTER_LOCK_MARKER';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof TrainerEffect && effect.player.marker.hasMarker(this.ECHOING_MADNESS_ITEM_LOCK_MARKER) &&
        effect.trainerCard.trainerType === TrainerType.ITEM) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    
    if (effect instanceof TrainerEffect && effect.player.marker.hasMarker(this.ECHOING_MADNESS_SUPPORTER_LOCK_MARKER) &&
        effect.trainerCard.trainerType === TrainerType.SUPPORTER) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ECHOING_MADNESS_ITEM_LOCK_MARKER)) {
      effect.player.marker.removeMarker(this.ECHOING_MADNESS_ITEM_LOCK_MARKER);
    }
    
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ECHOING_MADNESS_SUPPORTER_LOCK_MARKER)) {
      effect.player.marker.removeMarker(this.ECHOING_MADNESS_SUPPORTER_LOCK_MARKER);
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      const options = [
        {
          message: GameMessage.ITEMS,
          action: () => {
            opponent.marker.addMarker(this.ECHOING_MADNESS_ITEM_LOCK_MARKER, this);
            store.log(state, GameLog.LOG_PLAYER_DISABLES_ITEMS_UNTIL_END_OF_NEXT_TURN, { name: player.name, attack: this.attacks[0].name });
            return state;
          }
        },
        {
          message: GameMessage.SUPPORTERS,
          action: () => {
            opponent.marker.addMarker(this.ECHOING_MADNESS_SUPPORTER_LOCK_MARKER, this);
            store.log(state, GameLog.LOG_PLAYER_DISABLES_SUPPORTERS_UNTIL_END_OF_NEXT_TURN, { name: player.name, attack: this.attacks[0].name });            
            return state;
          }
        }
      ];
      
      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_ITEMS_OR_SUPPORTERS,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];

        if (option.action) {
          option.action();
        }
        
        return state;
      });
    }
    return state;
  }

}