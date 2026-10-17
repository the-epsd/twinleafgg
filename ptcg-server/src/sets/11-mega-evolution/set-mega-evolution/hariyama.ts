import { CardType, PokemonCard, Stage, StoreLike, State, StateUtils } from '../../../game';
import { PowerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  CONFIRMATION_PROMPT,
  IS_ABILITY_BLOCKED,
  JUST_EVOLVED,
  THIS_POKEMON_DOES_DAMAGE_TO_ITSELF,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Hariyama extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Makuhita';
  public cardType: CardType[] = [F];
  public hp = 150;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Sumo Catcher',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this card from your hand to evolve one of your Pokémon, you may switch one of your opponent\'s Benched Pokémon with their Active Pokémon.'
  }];

  public attacks = [{
    name: 'Wild Press',
    cost: [F, F, F],
    damage: 210,
    text: 'This Pokémon does 70 damage to itself.'
  },];

  public set = 'MEG';
  public setNumber: string = '73';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Hariyama';
  public fullName = 'Hariyama M1L';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sumo Catcher
    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, (result) => {
        if (result) {
          GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
          );
        }
      });
    }

    // Wild Press
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 70);
    }

    return state;
  }
}
