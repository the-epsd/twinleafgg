import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { PowerEffect } from '../../../game/store/effects/game-effects';
import { CONFIRMATION_PROMPT, MOVE_POKEMON_OFF_BOARD, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Starmie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Staryu';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [];

  public attacks = [{
    name: 'Star Boomerang',
    cost: [W],
    damage: 30,
    text: 'You may return Starmie and all cards attached to it to your hand.'
  },
  {
    name: 'Core Flash',
    cost: [P],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon that has any Poké-Powers or Poké-Bodies. This attack does 50 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Starmie';
  public fullName: string = 'Starmie LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Star Boomerang
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      CONFIRMATION_PROMPT(store, state, player, wantToReturn => {
        if (!wantToReturn) {
          return;
        }
        const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
        MOVE_POKEMON_OFF_BOARD(store, state, cardList, {
          pokemonDestination: player.hand,
          sourceCard: this,
        });
      }, GameMessage.WANT_TO_PICK_UP_POKEMON);
    }

    // Core Flash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          const target = selected[0];
          const targetCard = target.getPokemonCard();
          if (!targetCard || targetCard.powers.length === 0) {
            return state;
          }
          let hasAbility = false;
          for (const power of targetCard.powers) {
            const stubPowerEffect = new PowerEffect(
              opponent,
              power,
              targetCard,
            );
            try {
              store.reduceEffect(state, stubPowerEffect);
              if (power.powerType === PowerType.POKEBODY || power.powerType === PowerType.POKEPOWER) {
                hasAbility = true;
              }
            } catch {
              // blocked
            }
          }
          if (!hasAbility) {
            return state;
          }
          if (target === opponent.active) {
            const damageEffect = new DealDamageEffect(effect, 50);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          } else {
            const damageEffect = new PutDamageEffect(effect, 50);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          }
          return state;
        },
      );
    }

    return state;
  }
}
