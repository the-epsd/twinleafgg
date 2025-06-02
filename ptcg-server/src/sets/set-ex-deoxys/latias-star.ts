import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class LatiasStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STAR]
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: C }];
  public resistance = [{ type: P, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Healing Light',
      cost: [C],
      damage: 10,
      text: 'Remove 1 damage counter from each of your Pokémon (including Latias Star).'
    },
    {
      name: 'Shining Star',
      cost: [R, W, P],
      damage: 50,
      damageCalculation: '+',
      text: 'If the Defending Pokémon is Pokémon-ex, discard all Energy cards attached to Latias Star and this attack does 50 damage plus 100 more damage.'
    }
  ];

  public set: string = 'DX';
  public name: string = 'Latias Star';
  public fullName: string = 'Latias Star DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const healTargetEffect = new HealTargetEffect(effect, 10);
        healTargetEffect.target = cardList;
        state = store.reduceEffect(state, healTargetEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const defending = opponent.active;

      if (defending.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
        DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        effect.damage += 100;
      }
    }

    return state;
  }

}