import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AfterAttackEffect } from "../../game/store/effects/game-phase-effects";
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from "../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED, ADD_BURN_TO_PLAYER_ACTIVE } from "../../game/store/prefabs/prefabs";

export class Salazzleex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Salandit';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = R;
  public hp: number = 260;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Nasty Plot',
    cost: [R],
    damage: 0,
    text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Fatal Nail',
    cost: [R, R],
    damage: 100,
    text: 'Your opponent\'s Active Pokemon is now Poisoned and Burned. Switch this Pokemon with 1 of your Benched Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Salazzle ex';
  public fullName: string = 'Salazzle ex M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nasty Plot - Search deck for up to 2 cards
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      const maxCards = Math.min(2, player.deck.cards.length);
      let cards: any[] = [];

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: maxCards, allowCancel: false }
      ), selected => {
        cards = selected || [];
        player.deck.moveCardsTo(cards, player.hand);
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    // Fatal Nail - Poison + Burn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Poison and burn opponent's active
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, opponent, this);
    }

    // Fatal Nail - Switch (after attack)
    if (effect instanceof AfterAttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // Switch this Pokemon with benched Pokemon
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (hasBench) {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), selected => {
          const targets = selected || [];
          if (targets.length > 0) {
            player.active.clearEffects();
            player.switchPokemon(targets[0]);
          }
        });
      }
    }

    return state;
  }
}
