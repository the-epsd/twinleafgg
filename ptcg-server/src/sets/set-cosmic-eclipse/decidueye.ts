import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils, CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Decidueye extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dartrix';
  public cardType: CardType = G;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Skill Dive',
    cost: [G],
    damage: 0,
    text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
  },
  {
    name: 'Tracking Shot',
    cost: [C, C],
    damage: 80,
    text: 'This attack does 80 damage to 1 of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }
  ];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Decidueye';
  public fullName: string = 'Decidueye CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Skill Dive
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 40);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }

    // Tracking Shot
    if (WAS_ATTACK_USED(effect, 1, this)) {
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
        const damageEffect = new PutDamageEffect(effect, 80);
        damageEffect.target = target[0];
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;

  }
}
