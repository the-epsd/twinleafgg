import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ShuffleDeckPrompt, PowerType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Dudunsparce extends PokemonCard {
  
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Dunsparce';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Draw and Skedaddle',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may draw 3 cards. If you do, shuffle this Pokémon and all cards attached to it back into your deck.'
  }];

  public attacks = [
    {
      name: 'Land Crash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      text: ''
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SV5';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '57';

  public name: string = 'Dudunsparce';

  public fullName: string = 'Dudunsparce SV5';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      player.deck.moveTo(player.hand, 3);
      
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {

          cardList.moveTo(player.deck);
          cardList.clearEffects();
  
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
          });
  
        } else {
          return state;
        }
      });
    }
    return state;
  }
}