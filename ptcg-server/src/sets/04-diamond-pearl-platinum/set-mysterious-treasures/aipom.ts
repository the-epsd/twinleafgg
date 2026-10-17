import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Aipom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Whap',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Throw Off',
    cost: [C, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Before doing damage, discard all Pokémon Tool cards attached to that Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Aipom';
  public fullName: string = 'Aipom MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Throw Off
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        const target = selected[0];
        const tools = [...target.tools];
        for (const tool of tools) {
          MOVE_CARDS(store, state, target, opponent.discard, { cards: [tool], sourceCard: this });
        }

        if (target === opponent.active) {
          const damageEffect = new DealDamageEffect(effect, 20);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        } else {
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
