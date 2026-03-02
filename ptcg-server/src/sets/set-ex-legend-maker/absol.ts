import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, GameError } from '../../game';
import { IS_POKEBODY_BLOCKED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Absol extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Shining Horn',
    powerType: PowerType.POKEBODY,
    text: 'As long as Absol is the only Pokémon you have in play, your opponent\'s Basic Pokémon can\'t attack.'
  }];

  public attacks = [{
    name: 'Extra Call',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Pokémon-ex, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Feint Attack',
    cost: [D, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon.This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
  }];

  public set: string = 'LM';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Absol';
  public fullName: string = 'Absol LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect &&
      !IS_POKEBODY_BLOCKED(store, state, StateUtils.getOpponent(state, effect.player), this) &&
      effect.source.getPokemonCard()?.stage === Stage.BASIC) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      let hasBenchPokemon = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList === opponent.active) {
          return;
        }
        if (cardList.cards.length > 0) {
          hasBenchPokemon = true;
        }
      });

      if (opponent.active.getPokemonCard() === this && !hasBenchPokemon) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.tags.includes(CardTag.POKEMON_ex)) {
          return;
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 1, allowCancel: false, blocked });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0)
        return state;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const target = selected[0];
        target.damage += 20;
        const afterDamage = new AfterDamageEffect(effect, 20);
        state = store.reduceEffect(state, afterDamage);
      });
    }

    return state;
  }
} 