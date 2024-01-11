import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Jirachi extends PokemonCard {
  
  public stage = Stage.BASIC;

  public cardType = CardType.COLORLESS;

  public hp = 500;
  
  public weakness = [];
  
  public retreat = [];
  
  public attacks = [
    {
      name: 'Star Collection',
      cost: [ ],
      damage: 100,
      text: 'If your opponent\'s Active Pokémon has an Ability, draw 1 card.'
    }
  ];

  public set = 'TST';

  public cardImage: string = 'assets/jirachi-test.png';

  public setNumber = '1';

  public name = 'Jirachi TEST';

  public fullName = 'Jirachi TEST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active) {
        const opponentActive = opponent.active.getPokemonCard();

        if (opponentActive && opponentActive.powers.length > 0) {
          player.deck.moveTo(player.hand, 1);
        }
      }
      return state;
    }
    return state;
  }
}