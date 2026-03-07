import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, HAS_MARKER, IS_POKEBODY_BLOCKED, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

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

  public readonly GRANITE_HEAD_MARKER = 'GRANITE_HEAD_MARKER';

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
      ADD_MARKER(this.GRANITE_HEAD_MARKER, effect.player, this);
    }

    if (effect instanceof PutDamageEffect
      && HAS_MARKER(this.GRANITE_HEAD_MARKER, StateUtils.getOpponent(state, effect.player), this)
      && effect.target.getPokemonCard() === this) {

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 10;
    }

    if (effect instanceof EndTurnEffect && effect.player !== StateUtils.findOwner(state, StateUtils.findCardList(state, this))) {
      REMOVE_MARKER(this.GRANITE_HEAD_MARKER, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }
}