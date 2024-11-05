import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Espeonex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = P;

  public hp: number = 270;

  public weakness = [{ type: D }];

  public resistance = [{ type: F, value: -20 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Psych Out',
      cost: [P, C, C],
      damage: 160,
      text: 'Discard 1 random card from your opponent\'s hand.'
    },
    {
      name: 'Amethyst',
      cost: [G, P, D],
      damage: 0,
      text: 'Devolve each of your opponent\'s evolved Pokémon by shuffling the highest Stage Evolution card on it into your opponent’s deck.'
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'SV8a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Espeon ex';
  public fullName: string = 'Espeon ex SV8a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psych Out
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        opponent.hand.moveCardTo(randomCard, opponent.discard);
      }
    }

    // Amethyst
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.stage === Stage.STAGE_1 || card.stage === Stage.STAGE_2) {
          const pokemons = cardList.getPokemons();
          const latestEvolution = pokemons.slice(-1)[0];

          cardList.moveCardsTo([latestEvolution], opponent.deck);
          cardList.clearEffects();
        }
      });

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}