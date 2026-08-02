import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, PlayerType } from "../../../game";
import { CheckPokemonStatsEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED, THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from "../../../game/store/prefabs/prefabs";

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mysterious Fossil';
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Ancient Protection',
    powerType: PowerType.POKEBODY,
    text: 'Each of your Omanyte, Omastar, Kabuto, Kabutops, and Kabutops ex has no Weakness.'
  }];

  public attacks = [{
    name: 'Granite Head',
    cost: [C, C],
    damage: 20,
    text: 'During your opponent\'s next turn, any damage done to Kabuto by attacks is reduced by 10 (after applying Weakness and Resistance).'
  }];

  public set: string = 'LM';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kabuto';
  public fullName: string = 'Kabuto LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shield Veil
    if (effect instanceof CheckPokemonStatsEffect) {
      const player = StateUtils.findOwner(state, effect.target);

      let hasKabutoInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasKabutoInPlay = true;
        }
      });

      if (!hasKabutoInPlay) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.target.getPokemonCard()?.name === 'Omanyte' ||
        effect.target.getPokemonCard()?.name === 'Omastar' ||
        effect.target.getPokemonCard()?.name === 'Kabuto' ||
        effect.target.getPokemonCard()?.name === 'Kabutops' ||
        effect.target.getPokemonCard()?.name === 'Kabutops ex') {
        effect.weakness = [];
      }
    }

    // Granite Head
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 10);
    }

    return state;
  }
}