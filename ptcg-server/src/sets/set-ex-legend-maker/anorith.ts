import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Anorith extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Claw Fossil';
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Influence',
    cost: [C],
    damage: 0,
    text: 'Search your deck for Omanyte, Kabuto, Aerodactyl, Lileep, or Anorith and put up to 2 of them onto your Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as Basic Pokémon.'
  },
  {
    name: 'Stretch Claws',
    cost: [C, C],
    damage: 20,
    text: 'If Anorith has any React Energy cards attached to it, this attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Anorith';
  public fullName: string = 'Anorith LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && (card.name === 'Omanyte' || card.name === 'Kabuto' || card.name === 'Aerodactyl' || card.name === 'Lileep' || card.name === 'Anorith')) {
          return;
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, {}, { min: 0, max: 2, blocked });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.source.cards.some(c => c.name === 'React Energy')) {
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
      }
    }

    return state;
  }
}
