import { PokemonCard, Stage, CardType, StoreLike, State, SpecialCondition, GameMessage, ChooseCardsPrompt, Card, CardList, StateUtils } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Slowbro extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public evolvesFrom: string = 'Slowpoke';

  public cardType: CardType = CardType.WATER;

  public hp: number = 120;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tumbling Tackle',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: 'Both Active Pokémon are now Asleep.'
    },
    {
      name: 'Twilight Inspiration',
      cost: [  ],
      damage: 0,
      text: 'You can use this attack only if your opponent has exactly 1 Prize card remaining. Take 2 Prize cards.'
    }
  ];

  public set: string = 'PGO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '20';

  public name: string = 'Slowbro';

  public fullName: string = 'Slowbro LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);

      const player = effect.player;
      specialConditionEffect.target = player.active;
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();

      if (prizesTaken === 1) {
        
        const prizes = player.prizes as unknown as CardList;
        
        let cards: Card[] = [];
        
        state = store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_HAND,
          prizes, 
          {},
          { min: 2, allowCancel: true }
        ), selected => {
          cards = selected || [];
        });
        
        prizes.moveCardsTo(cards, player.hand);
        
        return state;
      }
    
      return state;
    }
    return state;

  }

}