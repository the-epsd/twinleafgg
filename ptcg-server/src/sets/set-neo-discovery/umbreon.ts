import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from "../../game";
import { AfterDamageEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Umbreon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Bite',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Feint Attack',
    cost: [D, D, C],
    damage: 0,
    shredAttack: true,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, Pokémon Powers, or any other effects on the Defending Pokémon.'
  }];

  public set: string = 'N2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Umbreon';
  public fullName: string = 'Umbreon N2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Feint Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
        ),
        (selected) => {
          const target = selected[0];
          target.damage += 30;
          const afterDamage = new AfterDamageEffect(effect, 30);
          state = store.reduceEffect(state, afterDamage);
        },
      );
    }

    return state;
  }
}
