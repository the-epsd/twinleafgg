import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { GameMessage } from '../../game/game-message';
import {ADD_POISON_TO_PLAYER_ACTIVE, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class GengarEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX ];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 170;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Night Attack',
      cost: [ C ],
      damage: 0,
      text: 'Put 3 damage counters on 1 of your opponent\'s Pokémon.'
    }, {
      name: 'Dark Corridor',
      cost: [ P, C, C ],
      damage: 60,
      text: 'Your opponent\'s Active Pokémon is now Poisoned. Switch this Pokémon with 1 of your Benched Pokémon.'
    },
  ];

  public set: string = 'PHF';
  public name: string = 'Gengar-EX';
  public fullName: string = 'Gengar-EX PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Night Attack
    if (WAS_ATTACK_USED(effect, 0, this)){
      return store.prompt(state, new ChoosePokemonPrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutCountersEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    // Dark Corridor
    if (WAS_ATTACK_USED(effect, 1, this)){
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }

    return state;
  }

}
