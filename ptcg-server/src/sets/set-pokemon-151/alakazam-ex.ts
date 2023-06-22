import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';


export class Alakazamex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  //public evolvesFrom = 'Alakazam';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Mind Jack',
      cost: [ CardType.COLORLESS ],
      damage: 90,
      text: ''
    },
    {
      name: 'Dimensional Manipulation',
      cost: [ CardType.COLORLESS ],
      damage: 120,
      text: 'You may use this attack even if this Pokemon is on the Bench.'
    }
  ];

  public set: string = '151';

  public name: string = 'Alakazam ex';

  public fullName: string = 'Alakazam ex MEW 065';


  reduceEffect(store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return store.prompt(state, new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_STARTING_POKEMONS, PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH]), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const attackEffect = new AttackEffect(player, opponent, this.attacks[1]);
        return store.reduceEffect(state, attackEffect);
      });
    }
    return state;
  }

  

}
