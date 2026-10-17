import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pachirisu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Smash Short',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'If the Defending Pokémon has a Pokémon Tool card attached to it, this attack does 10 damage plus 30 more damage. Discard that Pokémon Tool card, look at your opponent\'s hand, and discard any Pokémon Tool cards of the same name you find there.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Pachirisu';
  public fullName: string = 'Pachirisu GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call for Family
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store,
        state,
        effect.player,
        { stage: Stage.BASIC },
        { min: 0, max: 3, allowCancel: true }
      );
    }

    // Smash Short
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const tools = opponent.active.tools.slice();
      if (tools.length === 0) {
        return state;
      }

      effect.damage += 30;
      const tool = tools[0];
      const toolName = tool.name;
      opponent.active.moveCardTo(tool, opponent.discard);

      SHOW_CARDS_TO_PLAYER(store, state, effect.player, opponent.hand.cards);
      const matchingTools = opponent.hand.cards.filter(c => c.name === toolName);
      matchingTools.forEach(c => opponent.hand.moveCardTo(c, opponent.discard));
    }

    return state;
  }
}
