import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { AFTER_ATTACK, MULTIPLE_COIN_FLIPS_PROMPT, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';

export class Hitmontop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Rapid Spin',
    cost: [F],
    damage: 30,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon. If you do, your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
  },
  {
    name: 'Triple Kick',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 40 damage for each heads.'
  }];

  public set: string = 'LOT';
  public name: string = 'Hitmontop';
  public fullName: string = 'Hitmontop LOT';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      if (playerBench === 0) {
        return state;
      }

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false },
      ), selected => {
        if (!selected || selected.length === 0)
          return state;
        const target = selected[0];
        player.switchPokemon(target);
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 40 * heads;
      });
    }

    return state;
  }
}