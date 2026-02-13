import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameMessage, PlayerType, SlotType, StateUtils, StoreLike, State } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Manectric extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Electrike';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Energy Crush',
      cost: [L],
      damage: 20,
      damageCalculation: 'x' as 'x',
      text: 'Does 20 damage times the amount of Energy attached to all of your opponent\'s Pokémon.'
    },
    {
      name: 'Flash Impact',
      cost: [L, C, C],
      damage: 80,
      text: 'Does 20 damage to 1 of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '43';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Manectric';
  public fullName: string = 'Manectric DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Crush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const totalEnergy = GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON(opponent, store, state);
      effect.damage = 20 * totalEnergy;
    }

    // Flash Impact - does 20 damage to 1 of your own Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });
    }

    return state;
  }
}
