import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, THIS_ATTACK_DOES_X_MORE_DAMAGE, THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaSharpedoex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Carvanha';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 330;
  public weakness = [{ type: G }];
  public retreat = [];

  public attacks = [{
    name: 'Greedy Fangs',
    cost: [D],
    damage: 70,
    text: 'Draw 2 cards.',
  },
  {
    name: 'Hungry Jaw',
    cost: [D, D],
    damage: 120,
    damageCalculation: '+',
    text: 'If this Pokémon has any damage counters on it, this attack does 150 more damage.',
  }];

  public regulationMark: string = 'I';
  public set: string = 'PFL';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Sharpedo ex';
  public fullName: string = 'Mega Sharpedo ex M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }
      MOVE_CARDS(store, state, player.deck, player.hand, { count: 1 });
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, this)) {
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 150);
      }
    }
    return state;
  }
}