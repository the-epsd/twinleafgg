import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { countHideNSneakPokemonInDiscard, reduceHideNSneak } from './hide-n-sneak';

export class Sinistcha extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Poltchageist';
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [
    {
      name: "Hide 'n' Sneak",
      powerType: PowerType.ABILITY,
      text: "Prevent all effects of your opponent's Pokémon's attacks and Abilities done to this Pokémon. (Damage is not an effect.)",
    },
  ];

  public attacks = [
    {
      name: 'Matcha Spin',
      cost: [C],
      damage: 0,
      text: "If you have 6 or more Pokémon that have the Hide 'n' Sneak Ability in your discard pile, place 4 damage counters on each of your opponent's Pokémon.",
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '6';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sinistcha';
  public fullName: string = 'Sinistcha M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    reduceHideNSneak(store, state, effect, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      effect.damage = 0;

      if (countHideNSneakPokemonInDiscard(player) < 6) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.cards.length === 0) {
          return;
        }
        const counters = new PlaceDamageCountersEffect(player, cardList, 40, this);
        store.reduceEffect(state, counters);
      });
    }

    return state;
  }
}
