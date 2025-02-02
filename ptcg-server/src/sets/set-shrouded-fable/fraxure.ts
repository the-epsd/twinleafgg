import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, CardList, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Fraxure extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Axew';
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 100;
  public weakness = [];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Unnerve',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent plays an Item or Supporter card from their hand, prevent all effects of that card done to this Pokemon.'
  }];
  public attacks = [{
    name: 'Dragon Pulse',
    cost: [CardType.FIGHTING, CardType.METAL],
    damage: 80,
    text: 'Discard the top card of your deck'
  }];

  public set: string = 'SFA';
  public name: string = 'Fraxure';
  public fullName: string = 'Fraxure SFA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public regulationMark: string = 'H';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 1);
      const discards = deckTop.cards;
  
      deckTop.moveTo(player.discard, deckTop.cards.length);

      discards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: card.name, effectName: effect.attack.name });
      });
      return state;
    }
    
    return state;
  }
}