import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gumshoos extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yungoos';
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Alert Headbutt',
    cost: [C, C],
    damage: 90,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a Pokémon-GX or Pokémon-EX, this attack\'s base damage is 30.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '181';
  public name: string = 'Gumshoos';
  public fullName: string = 'Gumshoos UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const opponentActive = opponent.active.getPokemonCard();

      if (opponentActive &&
        (opponentActive.tags.includes(CardTag.POKEMON_GX) ||
          opponentActive.tags.includes(CardTag.POKEMON_EX))) {
        effect.damage = 30;
      }
    }

    return state;
  }
}

