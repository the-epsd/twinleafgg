import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, Card, ChooseCardsPrompt, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { JUST_EVOLVED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

export class Banette extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shuppet';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Red Eyes',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put a Basic Pokémon from your opponent\'s discard pile onto their Bench.'
  }];

  public attacks = [{
    name: 'Enemy Show',
    cost: [P, C],
    damage: 0,
    text: 'For each of your opponent\'s Pokémon in play, put 1 damage counter on your opponent\'s Pokémon in any way you like.'
  }];

  public set = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name = 'Banette';
  public fullName = 'Banette CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if opponent's bench is full
      const openSlots = opponent.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        return state;
      }

      if (!opponent.discard.cards.some(c => c instanceof PokemonCard && c.stage === Stage.BASIC)) {
        return state;
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_OPPONENTS_BASIC_POKEMON_TO_BENCH,
        opponent.discard,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        if (cards.length > 0) {
          const card = cards[0];
          const slot = openSlots[0];
          MOVE_CARDS(store, state, opponent.discard, slot, { cards: [card], sourceCard: this, sourceEffect: this.powers[0] });
          slot.pokemonPlayedTurn = state.turn;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(opponentBench + 1, store, state, effect);
    }

    return state;
  }

}