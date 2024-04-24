import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, 
  StateUtils, GameMessage, ConfirmPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class LugiaVSTAR extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 140;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Ground Crack',
      cost: [ ],
      damage: 30,
      text: 'If a Stadium is in play, this attack does 30 damage to each of your opponent\'s Benched Pokémon. Then, discard that Stadium. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Hammer In',
      cost: [ ],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'SV6';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Ting-Lu';

  public fullName: string = 'Ting-Lu SV6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {

        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToUse => {
          if (wantToUse) {
    
            // Discard Stadium
            const cardList = StateUtils.findCardList(state, stadiumCard);
            const player = StateUtils.findOwner(state, cardList);
            cardList.moveTo(player.discard);
            return state;
          }
          return state;
        });
      }
      return state;
    }
    return state;
  }
}