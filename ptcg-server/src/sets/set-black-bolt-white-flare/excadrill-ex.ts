import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils, CardTarget, PlayerType, SlotType, ChoosePokemonPrompt, GameMessage } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Excadrillex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardTag = [CardTag.POKEMON_ex];
  public evolvesFrom = 'Drillbur';
  public cardType = F;
  public hp: number = 270;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Penetrating Drill',
    cost: [F, F],
    damage: 60,
    text: 'This attack also does 60 damage to 1 of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Rock Tumble',
    cost: [F, F, F],
    damage: 200,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Excadrill ex';
  public fullName: string = 'Excadrill ex SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const damagedBenchedPokemon = opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0);
      if (damagedBenchedPokemon.length === 0) {
        return state;
      }

      const blocked: CardTarget[] = [];
      opponent.bench.forEach((b, index) => {
        if (b.damage === 0) {
          blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), target => {
        if (!target || target.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 60);
        damageEffect.target = target[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
      return state;
    }
    return state;
  }
}
