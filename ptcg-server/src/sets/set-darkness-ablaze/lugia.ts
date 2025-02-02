import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class Lugia extends PokemonCard {

  public regulationMark = 'D';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Gust',
      cost: [ CardType.COLORLESS ],
      damage: 30,
      text: ''
    }, {
      name: 'Energy Loop',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 120,
      text: 'Put an Energy attached to this Pokémon into your hand.'
    },
  ];

  public set: string = 'DAA';

  public name: string = 'Lugia';

  public fullName: string = 'Lugia DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '140';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
  
      let card: Card;
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        card = selected[0];
  
        player.active.moveCardTo(card, player.hand);
        return state;
      });
    }
    return state;
  }
}