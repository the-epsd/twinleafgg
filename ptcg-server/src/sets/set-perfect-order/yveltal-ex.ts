import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, StateUtils, PlayerType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { CheckHpEffect } from "../../game/store/effects/check-effects";
import { KnockOutEffect } from "../../game/store/effects/game-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Yveltalex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 210;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Death Soul',
    cost: [D, D, C],
    damage: 0,
    text: 'Knock Out each of your opponent\'s Pokemon that has 50 HP or less remaining.'
  },
  {
    name: 'Dark Strike',
    cost: [D, D, C],
    damage: 210,
    text: 'During your next turn, this Pokemon can\'t use Dark Strike.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Yveltal ex';
  public fullName: string = 'Yveltal ex M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Death Soul - KO opponent's Pokemon with ≤50 HP remaining
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check all opponent's Pokemon
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        const remainingHp = checkHpEffect.hp - cardList.damage;

        if (remainingHp <= 50) {
          const koEffect = new KnockOutEffect(opponent, cardList);
          store.reduceEffect(state, koEffect);
        }
      });
    }

    // Dark Strike - cannot use next turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Dark Strike')) {
        player.active.cannotUseAttacksNextTurnPending.push('Dark Strike');
      }
    }

    return state;
  }
}
