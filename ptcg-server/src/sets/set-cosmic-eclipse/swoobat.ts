import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, ChoosePokemonPrompt, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Swoobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Woobat';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Supersonic',
      cost: [C],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    },
    {
      name: 'Charming Stamp',
      cost: [P],
      damage: 0,
      text: 'Your opponent chooses 1 of their own Pokémon. This attack does 90 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },

  ];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Swoobat';
  public fullName: string = 'Swoobat CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Supersonic
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    // Charming Stamp
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new DealDamageEffect(effect, 90);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}