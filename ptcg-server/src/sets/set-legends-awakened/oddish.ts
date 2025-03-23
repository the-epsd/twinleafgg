import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Oddish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P, value: +10}];
  public retreat = [C];

  public attacks = [{
    name: 'Poisonpowder',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Ram',
    cost: [P, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Oddish';
  public fullName: string = 'Oddish LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
        
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this); 
        }
      });
    }
    return state;
  }
}