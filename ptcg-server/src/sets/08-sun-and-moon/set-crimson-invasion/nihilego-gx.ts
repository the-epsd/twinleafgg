import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State, StateUtils, ConfirmPrompt, GameMessage, SpecialCondition, CardList } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { PlayPokemonEffect } from "../../../game/store/effects/play-card-effects";
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from "../../../game/store/prefabs/effect-of-ability-prefabs";
import { BLOCK_RETREAT } from "../../../game/store/prefabs/effect-of-attack-prefabs";
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, BLOCK_IF_GX_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class NihilegoGx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_GX, CardTag.ULTRA_BEAST];
  public hp: number = 180;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Empty Light',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may leave both Active Pokémon Confused and Poisoned.',
  }];

  public attacks = [{
    name: 'Lock Up',
    cost: [P, P, P],
    damage: 120,
    text: "The Defending Pokémon can't retreat during your opponent's next turn.",
  },
  {
    name: 'Symbiont-GX',
    cost: [P, P, P],
    damage: 0,
    text: "Add the top 2 cards of your opponent's deck to their Prize cards. (You can't use more than 1 GX attack in a game.)",
  }];

  public set: string = 'CIN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Nihilego-GX';
  public fullName: string = 'Nihilego-GX CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Empty Light
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      state = store.prompt(
        state,
        new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY),
        (wantToUse) => {
          if (wantToUse) {
            APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
              store,
              state,
              player,
              this.powers[0],
              this,
              player.active,
              [SpecialCondition.CONFUSED, SpecialCondition.POISONED],
            );
            APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
              store,
              state,
              player,
              this.powers[0],
              this,
              opponent.active,
              [SpecialCondition.CONFUSED, SpecialCondition.POISONED],
            );
          }
        },
      );
    }

    // Lock Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    // Symbiont-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const cardsToMove = Math.min(2, opponent.deck.cards.length);
      if (cardsToMove > 0) {
        const allPrizeCards = new CardList();
        opponent.prizes.forEach((prizeList) => {
          allPrizeCards.cards.push(...prizeList.cards);
        });

        opponent.deck.cards.slice(0, cardsToMove).forEach((card) => {
          allPrizeCards.cards.push(card);
        });
        opponent.deck.cards.splice(0, cardsToMove);

        const prizeCount = allPrizeCards.cards.length;
        opponent.prizes = [];
        for (let i = 0; i < prizeCount; i++) {
          const newPrizeList = new CardList();
          newPrizeList.isSecret = true;
          newPrizeList.cards.push(allPrizeCards.cards[i]);
          opponent.prizes.push(newPrizeList);
        }
      }
    }

    return state;
  }
}
