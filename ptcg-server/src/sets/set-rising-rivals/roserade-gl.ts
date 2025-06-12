import { ChoosePokemonPrompt, GameMessage, PlayerType, SelectOptionPrompt, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';
import { ADD_MARKER, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class RoseradeGL extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public tags = [CardTag.POKEMON_SP];
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Poison Bind',
      cost: [C],
      damage: 10,
      text: 'The Defending Pokémon is now Poisoned and can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Long Whip',
      cost: [G, C],
      damage: 30,
      text: ' the Defending Pokémon is affected by any Special Conditions, you may do 30 damage to any 1 Benched Pokémon instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'RR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Roserade GL';
  public fullName: string = 'Roserade GL RR';

  public readonly POISON_BIND_MARKER: string = 'POISON_BIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.POISON_BIND_MARKER, opponent.active, this);
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.POISON_BIND_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.POISON_BIND_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.specialConditions.length > 0) {
        state = store.prompt(state, new SelectOptionPrompt(
          player.id,
          GameMessage.CHOOSE_OPTION,
          [
            'Do 30 damage to opponent\'s active',
            'Do 30 damage to 1 of the opponent\'s benched Pokémon',
            'Do 30 damage to your own benched Pokémon'
          ],
          {
            allowCancel: false,
            defaultValue: 0
          }
        ), choice => {
          if (choice === 0) {
            return state;
          } else if (choice === 1) {
            THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state);
          } else if (choice === 2) {
            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH],
            ), selected => {
              const target = selected[0];
              const damageEffect = new PutDamageEffect(effect, 30);
              damageEffect.target = target;
              store.reduceEffect(state, damageEffect);
            });
          }
        });
      }
    }

    return state;
  }
}