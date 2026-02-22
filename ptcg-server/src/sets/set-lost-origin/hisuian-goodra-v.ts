import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { ChoosePokemonPrompt, PlayerType, PokemonCard, SlotType, StateUtils } from '../../game';

import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HisuianGoodraV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'F';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 220;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Slip-\'n\'-Trip',
      cost: [CardType.WATER, CardType.METAL],
      damage: 60,
      text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
    },
    {
      name: 'Rolling Shell',
      cost: [CardType.WATER, CardType.METAL, CardType.COLORLESS],
      damage: 140,
      text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '135';

  public name: string = 'Hisuian Goodra V';

  public fullName: string = 'Hisuian Goodra V LOR';

  private usedSlipNTrip: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedSlipNTrip = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSlipNTrip) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentHasBenched = opponent.bench.some(b => b.cards.length > 0);

      if (!opponentHasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false },
      ), selected => {
        if (!selected || selected.length === 0) {
          return state;
        }
        const target = selected[0];
        opponent.switchPokemon(target);
        this.usedSlipNTrip = false;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.damageReductionNextTurn = 30;
    }
    return state;
  }
}
