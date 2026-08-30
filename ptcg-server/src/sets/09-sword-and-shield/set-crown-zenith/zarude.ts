import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, GameError, ChoosePokemonPrompt, PlayerType, SlotType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Zarude extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Drag Off',
    cost: [G],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.This attack does 20 damage to the new Active Pokémon.'
  }, {
    name: 'Triple Whip',
    cost: [G, G],
    damage: 70,
    damageCalculation: 'x',
    text: ' Flip 3 coins. This attack does 70 damage for each heads. '
  }];

  public set: string = 'CRZ';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Zarude CRZ';
  public name: string = 'Zarude';
  public setNumber: string = '16';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = opponent.active;
        store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      state = MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 70 * heads;
      });
      return state;
    }

    return state;
  }
}