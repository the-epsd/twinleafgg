import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, PlayerType, TrainerCard, Card, ChooseCardsPrompt, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Spiritomb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Lightless World',
      cost: [ C ],
      damage: 0,
      text: 'Put 2 Supporter cards from your discard pile into your hand.'
    },
    {
      name: 'Terrify',
      cost: [ C ],
      damage: 10,
      text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
    },
    
  ];

  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Spiritomb';
  public fullName: string = 'Spiritomb UPR';

  public readonly TERRIFY_MARKER = 'TERRIFY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lightless World
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;
      let supporterAmount = 0;

      player.discard.cards.forEach(c => {
        if (c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER){
          supporterAmount++;
        }
      });
    
      if (!supporterAmount) {
        return state;
      }
    
      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 2, allowCancel: true }
      ), selected => {
        cards = selected || [];
        
        cards.forEach(card => {
          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
        });
      
        if (cards.length > 0) {
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }
      
        if (cards.length > 0) {
          player.discard.moveCardsTo(cards, player.hand);
        }
      });
    }

    // Terrify
    if (WAS_ATTACK_USED(effect, 1, this)){
      const opponent = effect.opponent;
      if (opponent.active.getPokemonCard()?.stage === Stage.BASIC){
        opponent.active.marker.addMarker(this.TERRIFY_MARKER, this);
        opponent.marker.addMarker(this.TERRIFY_MARKER, this);
      }
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.TERRIFY_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TERRIFY_MARKER, this)) {
      effect.player.marker.removeMarker(this.TERRIFY_MARKER, this);
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.marker.hasMarker(this.TERRIFY_MARKER, this)){
          cardList.marker.removeMarker(this.TERRIFY_MARKER, this);
        }
      });
    }

    return state;
  }
}