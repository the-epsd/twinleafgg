import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


export class TyranitarV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_V, CardTag.SINGLE_STRIKE ];

  public cardType: CardType = CardType.DARK;

  public hp: number = 230;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Cragalanche',
      cost: [ CardType.DARK, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 60,
      text: 'Discard the top 2 cards of your opponent\'s deck.'
    },
    {
      name: 'Single Strike Crush',
      cost: [ CardType.DARK, CardType.DARK, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 240,
      text: 'Discard the top 4 cards of your deck.'
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public name: string = 'Tyranitar V';

  public fullName: string = 'Tyranitar V BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
        
      // Discard 2 cards from opponent's deck 
      opponent.deck.moveTo(opponent.discard, 2);
        
    }
  


    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      
      // Discard 4 cards from your deck 
      player.deck.moveTo(player.discard, 4);
      return state;
    }

    return state;
  }

}
