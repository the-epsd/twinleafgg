import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class StoutlandV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = C;
  public hp: number = 210;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Double Dip Fangs',
    cost: [C, C, C],
    damage: 40,
    text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from this attack, take 1 more Prize card.'
  },
  {
    name: 'Wild Tackle',
    cost: [C, C, C, C],
    damage: 200,
    text: 'This Pokémon also does 30 damage to itself.'
  }];

  public set: string = 'BST';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public name: string = 'Stoutland V';
  public fullName: string = 'Stoutland V BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      attackName: 'Double Dip Fangs',
      validate: (store, state, koEffect) => koEffect.target.isStage(Stage.BASIC),
    });
  }

}

