import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ShuffleDeckPrompt, PowerType, PlayerType, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Dudunsparce extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Dunsparce';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Run Away Draw',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may draw 3 cards. If you drew any cards in this way, shuffle this Pokémon and all attached cards into your deck.'
  }];

  public attacks = [
    {
      name: 'Land Crash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      text: ''
    }
  ];

  public regulationMark = 'H';

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '129';

  public name: string = 'Dudunsparce';

  public fullName: string = 'Dudunsparce TEF';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.deck.moveTo(player.hand, 3);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          const pokemons = cardList.getPokemons();
          const otherCards = cardList.cards.filter(card =>
            !(card instanceof PokemonCard) &&
            (!cardList.tools || !cardList.tools.includes(card))
          );
          const tools = [...cardList.tools];
          cardList.clearEffects();
          // Move Pokémon cards to the deck
          if (pokemons.length > 0) {
            MOVE_CARDS(store, state, cardList, player.deck, { cards: pokemons });
          }

          // Move other cards (tools, energies, etc.) to the deck
          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.deck, { cards: otherCards });
          }

          // Move tools to the deck
          if (tools.length > 0) {
            for (const tool of tools) {
              cardList.moveCardTo(tool, player.deck);
            }
          }
          cardList.clearEffects();

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
          });
        }
      });
    }
    return state;
  }
}