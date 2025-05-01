import { Card, ChooseCardsPrompt, GameError, GameLog, GameMessage, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { CardTag, CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';
import {MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class FloatzelGL extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public tags = [ CardTag.POKEMON_SP ];
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Incite',
      cost: [ ],
      damage: 0,
      text: 'Search your discard pile for up to 2 Supporter cards, show them to your opponent, and put them into your hand.'
    },
    {
      name: 'Giant Wave',
      cost: [W, W],
      damage: 50,
      text: 'Floatzel GL can\'t use Giant Wave during your next turn.'
    }
  ];

  public set: string = 'RR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Floatzel GL';
  public fullName: string = 'Floatzel GL RR';

  public readonly GIANT_WAVE_MARKER = 'GIANT_WAVE_MARKER';
  public readonly CLEAR_GIANT_WAVE_MARKER = 'CLEAR_GIANT_WAVE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Incite
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
    
      const hasSupporter = player.discard.cards.some(c => {
        return c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER;
      });
    
      if (!hasSupporter) {
        return state;
      }
    
      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 2, allowCancel: true }
      ), selected => {
        cards = selected || [];
        
        if (cards.length > 0){
          cards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });

          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          MOVE_CARDS(store, state, player.discard, player.hand, { cards: cards });
        }
      });
    }

    // Giant Wave
    if (WAS_ATTACK_USED(effect, 1, this)){
      if (effect.player.marker.hasMarker(this.GIANT_WAVE_MARKER, this)){ throw new GameError(GameMessage.BLOCKED_BY_EFFECT); }

      effect.player.marker.addMarker(this.GIANT_WAVE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_GIANT_WAVE_MARKER, this)) {
      effect.player.marker.removeMarker(this.GIANT_WAVE_MARKER, this);
      effect.player.marker.removeMarker(this.CLEAR_GIANT_WAVE_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.GIANT_WAVE_MARKER, this)) {
      effect.player.marker.addMarker(this.CLEAR_GIANT_WAVE_MARKER, this);
      console.log('second marker added');
    }

    return state;
  }
}