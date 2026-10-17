import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_DECK_FOR_CARDS_TO_HAND, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bronzor';
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public resistance = [{ type: R, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Cycler',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may choose a card from your hand and put it on top of your deck. Then, search your deck for up to 2 basic Energy cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward. This power can\'t be used if Bronzong is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Strange Spin',
    cost: [P, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If you have the same number of cards in your hand as your opponent, this attack does 20 damage plus 40 more damage and the Defending Pokémon is now Confused.'
  },
  {
    name: 'Heavy Potential',
    cost: [P, C, C],
    damage: 0,
    text: 'Put a number of damage counters on each of your opponent\'s Pokémon equal to the number of Colorless Energy in that Pokémon\'s Retreat Cost (after applying effects to the Retreat Cost).'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong SF';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cycler
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      if (player.hand.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.hand,
        {},
        { min: 1, max: 1, allowCancel: true },
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        cards.reverse().forEach(card => {
          player.hand.moveCardTo(card, player.deck);
        });
        SEARCH_DECK_FOR_CARDS_TO_HAND(
          store,
          state,
          player,
          this,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 0, max: 2, allowCancel: false },
          this.powers[0],
        );
      });
    }

    // Strange Spin
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.hand.cards.length === opponent.hand.cards.length) {
        effect.damage += 40;
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      }
    }

    // Heavy Potential
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, pokemonCard) => {
        if (!pokemonCard) {
          return;
        }
        let retreatCost = [...pokemonCard.retreat];
        if (cardList === opponent.active) {
          const checkRetreat = new CheckRetreatCostEffect(opponent);
          store.reduceEffect(state, checkRetreat);
          retreatCost = checkRetreat.cost;
        }
        const colorlessCount = retreatCost.filter(c => c === CardType.COLORLESS).length;
        if (colorlessCount === 0) {
          return;
        }
        const countersEffect = new PutCountersEffect(effect, colorlessCount * 10);
        countersEffect.target = cardList;
        store.reduceEffect(state, countersEffect);
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
