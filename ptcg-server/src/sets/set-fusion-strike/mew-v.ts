import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ShuffleDeckPrompt, GameMessage, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class MewV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V, CardTag.FUSION_STRIKE ];

  public regulationMark = 'E';
  
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 180;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ ];

  public attacks = [
    {
      name: 'Strafe',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: 'Search your deck for an Energy card and attach it to 1 of  ' +
      'your Fusion Strike Pokémon. Then, shuffle your deck.'
    }, {
      name: 'Psychic Leap',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 70,
      text: 'You may shuffle this Pokémon and all attached cards into your deck.'
    }
  ];

  public set: string = 'FST';

  public set2: string = 'fusionstrike';

  public setNumber: string = '113';

  public name: string = 'Mew V';

  public fullName: string = 'Mew V FST 113';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
  
      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
  
          player.active.moveTo(player.deck);
          player.active.clearEffects();
  
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