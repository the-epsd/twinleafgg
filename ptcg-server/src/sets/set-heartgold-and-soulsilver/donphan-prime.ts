import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PowerType, StoreLike, State, GamePhase, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Donphan extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Phanpy';
  public tags = [CardTag.PRIME];
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Exoskeleton',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to Donphan by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Earthquake',
    cost: [F],
    damage: 60,
    text: 'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Heavy Impact',
    cost: [F, F, F],
    damage: 90,
    text: ''
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Donphan';
  public fullName: string = 'Donphan HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      if (state.phase === GamePhase.ATTACK) {
        effect.damage -= 20;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        const damage = new PutDamageEffect(effect, 10);
        damage.target = cardList;
        store.reduceEffect(state, damage);
      });
    }

    return state;
  }
}

