import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { DRAW_CARDS, MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Unown extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Farewell Letter',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokemon is ' +
      'on your Bench, you may discard this Pokemon and all cards attached ' +
      'to it (this does not count as a Knock Out). If you do, draw a card.'
  }];

  public attacks = [
    {
      name: 'Hidden Power',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'AOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public name: string = 'Unown';

  public fullName: string = 'Unown AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      // check if UnownR is on player's Bench
      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
      if (benchIndex === -1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const monCardList = player.bench[benchIndex];
      const pokemons = monCardList.getPokemons();
      const otherCards = monCardList.cards.filter(card =>
        !(card instanceof PokemonCard) &&
        !pokemons.includes(card as PokemonCard) &&
        (!monCardList.tools || !monCardList.tools.includes(card))
      );
      const tools = [...monCardList.tools];
      // Move Pokémon cards to the discard
      if (pokemons.length > 0) {
        MOVE_CARDS(store, state, cardList, player.discard, { cards: pokemons });
      }
      // Move other cards (tools, energies, etc.) to the discard
      if (otherCards.length > 0) {
        MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
      }
      // Move tools to the discard
      if (tools.length > 0) {
        for (const tool of tools) {
          cardList.moveCardTo(tool, player.discard);
        }
      }

      DRAW_CARDS(player, 1);
      return state;
    }

    return state;
  }

}
