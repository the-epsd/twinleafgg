import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import {
  StoreLike, State, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt, CardTarget,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealTargetEffect } from '../../../game/store/effects/attack-effects';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class HoOh extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sacred Breath',
    cost: [R, R],
    damage: 0,
    text: 'Discard all Energy from this Pokémon. Heal all damage from 1 of your Benched Pokémon.'
  },
  {
    name: 'Fire Wing',
    cost: [R, R, R],
    damage: 100,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Ho-Oh';
  public fullName: string = 'Ho-Oh 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sacred Breath
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);

      const hasDamagedBench = player.bench.some(b => b.cards.length > 0 && b.damage > 0);
      if (!hasDamagedBench) {
        return state;
      }

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList === player.active || cardList.damage === 0) {
          blocked.push(target);
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), selected => {
        if (!selected || selected.length === 0) {
          return;
        }
        const target = selected[0];
        const healEffect = new HealTargetEffect(effect, target.damage);
        healEffect.target = target;
        store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }
}
