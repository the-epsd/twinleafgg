import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CONFIRMATION_PROMPT, DRAW_CARDS, IS_ABILITY_BLOCKED, JUST_EVOLVED } from '../../game/store/prefabs/prefabs';
import { PowerType, StoreLike, State, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Kadabra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Abra';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Psychic Draw',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may draw 2 cards.'
  }];

  public attacks = [{
    name: 'Super Psy Bolt',
    cost: [P],
    damage: 30,
    text: ''
  }];

  public set: string = 'M1S';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Kadabra';
  public fullName: string = 'Kadabra M1S';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          DRAW_CARDS(player, 2);
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    return state;
  }
}

