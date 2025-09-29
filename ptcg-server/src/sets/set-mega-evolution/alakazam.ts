import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CONFIRMATION_PROMPT, DRAW_CARDS, IS_ABILITY_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PowerType, StoreLike, State, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Alakazam extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kadabra';
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Psychic Draw',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may draw 3 cards.'
  }];

  public attacks = [{
    name: 'Hand Power',
    cost: [P],
    damage: 0,
    text: 'Put 2 damage counters on your opponent\'s Active Pokémon for each card in your hand.'
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Alakazam';
  public fullName: string = 'Alakazam M1S';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          DRAW_CARDS(player, 3);
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(effect.player.hand.cards.length * 2, store, state, effect);
    }

    return state;
  }
}

