import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { GameError, PowerType } from '../../game';


export class Squawkabillyex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_ex ];

  public regulationMark = 'G';

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{
    type: CardType.LIGHTNING,
    value: 10
  }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Squawk and Seize',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your first turn, you may discard your hand and draw 6 cards. You can\'t use more than 1 Squawk and Seize Ability during your turn.'
  }];


  public attacks = [{
    name: 'Motivate',
    cost: [ CardType.COLORLESS ],
    damage: 20,
    text: 'Attach up to 2 Basic Energy cards from your discard pile to 1 of your Benched Pokémon.'
  }];

  public set: string = 'PAL';

  public name: string = 'Squawkabilly ex';

  public fullName: string = 'Squawkabilly ex PAL';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      // Get current turn
      const turn = state.turn;
      
      // Check if it is player's first turn
      if (turn > 2) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      } else {

        if (player.usedSquawkAndSeizeThisTurn) {
          throw new GameError(GameMessage.POWER_ALREADY_USED);
        }
        // Discard hand and draw cards
        player.hand.moveTo(player.discard);
        // Draw 6 cards
        player.deck.moveTo(player.hand, 6);
        // Mark power as used this turn
        player.usedSquawkAndSeizeThisTurn = true;
        // Return updated state
        return state;
      }
    }
    return state;
  }
}