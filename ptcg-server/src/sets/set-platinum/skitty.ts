import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Skitty extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Heal Bell',
      cost: [],
      damage: 0,
      text: 'Remove 1 damage counter from each of your Pokémon.'
    },
    {
      name: 'Take Down',
      cost: [C],
      damage: 20,
      text: 'Skitty does 10 damage to itself.'
    },
  ];

  public set: string = 'PL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Skitty';
  public fullName: string = 'Skitty PL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        const healEffect = new HealEffect(player, cardList, 10);
        state = store.reduceEffect(state, healEffect);
        return state;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
      return state;
    }
    
    return state;
  }
}
