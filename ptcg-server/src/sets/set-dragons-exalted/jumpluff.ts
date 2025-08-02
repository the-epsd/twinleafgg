import { PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Jumpluff extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Skiploom';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Cowardice',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard all cards attached to this Pokémon and return it to your hand. You can\'t use this Ability during your first turn or on the turn this Pokémon was put into play.'
  }];

  public attacks = [{
    name: 'Acrobatics',
    cost: [G],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
  }];

  public set: string = 'DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Jumpluff';
  public fullName: string = 'Jumpluff DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      const pokemonCardList = cardList as PokemonCardList;
      const jumpluffCard = pokemonCardList.getPokemonCard();
      if (!jumpluffCard) {
        return state;
      }

      const pokemons = pokemonCardList.getPokemons();
      const otherCards = cardList.cards.filter(card =>
        !(card instanceof PokemonCard) &&
        (!pokemonCardList.tools || !pokemonCardList.tools.includes(card))
      );
      const tools = [...pokemonCardList.tools];

      // Move tools to discard first
      if (tools.length > 0) {
        for (const tool of tools) {
          pokemonCardList.moveCardTo(tool, player.hand);
        }
      }

      // Move other cards to hand
      if (otherCards.length > 0) {
        MOVE_CARDS(store, state, cardList, player.hand, { cards: otherCards });
      }

      // Move Pokémon to hand
      if (pokemons.length > 0) {
        MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage += 30 * heads;
      });
    }

    return state;
  }
}