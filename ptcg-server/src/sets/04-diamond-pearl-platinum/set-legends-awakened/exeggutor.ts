import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { DRAW_CARDS, MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Exeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Exeggcute';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Psychic Strategy',
    cost: [],
    damage: 0,
    text: 'Each player counts the number of cards in his or her opponent\'s hand. Each player shuffles his or her hand into his or her deck. Then, each player draws a number of cards up to the number of cards his or her opponent had. (You draw your cards first.)'
  },
  {
    name: 'Super Eggsplosion',
    cost: [P],
    damage: 50,
    damageCalculation: 'x',
    text: 'Discard as many Energy cards as you like attached to your Pokémon. For each Energy card you discarded, flip a coin. This attack does 50 damage times the number of heads.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Exeggutor';
  public fullName: string = 'Exeggutor LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic Strategy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardsToDrawPlayer = opponent.hand.cards.length;
      const cardsToDrawOpponent = player.hand.cards.length;

      if (player.hand.cards.length > 0) {
        MOVE_CARDS(store, state, player.hand, player.deck, { sourceCard: this });
        SHUFFLE_DECK(store, state, player);
      }
      if (opponent.hand.cards.length > 0) {
        MOVE_CARDS(store, state, opponent.hand, opponent.deck, { sourceCard: this });
        SHUFFLE_DECK(store, state, opponent);
      }
      DRAW_CARDS(store, state, player, cardsToDrawPlayer);
      DRAW_CARDS(store, state, opponent, cardsToDrawOpponent);
    }

    // Super Eggsplosion
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let energyCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);
        energyCount += checkProvidedEnergy.energyMap.length;
      });
      if (energyCount > 0) {
        MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, results => {
          const heads = results.filter(r => r).length;
          effect.damage = 50 * heads;
        });
      }
    }

    return state;
  }
}
