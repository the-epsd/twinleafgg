import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, DAMAGE_OPPONENT_POKEMON, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class EmpoleonLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  public evolvesFrom: string = 'Empoleon';
  protected _tags = [CardTag.POKEMON_LV_X];
  public hp: number = 140;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Supreme Command',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may choose up to 2 cards from your opponent\'s hand without looking and put them face down next to the Defending Pokémon. (These cards are not in play or in your opponent\'s hand.) At the end of your opponent\'s next turn, return those cards to your opponent\'s hand. This power can\'t be used if Empoleon is affected by a Special Condition.',
  }];

  public attacks = [{
    name: 'Hydro Impact',
    cost: [W, W, W],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 80 damage to that Pokémon (Don\'t apply Weakness and Resistance for Benched Pokémon.) Empoleon can\'t attack during your next turn.',
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '120';
  public name: string = 'Empoleon';
  public fullName: string = 'Empoleon LV.X DP';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public readonly SUPREME_COMMAND_MARKER = 'SUPREME_COMMAND_MARKER';
  public supremeCommandCards = new CardList();

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // Return set-aside cards at the end of the opponent's next turn
    if (effect instanceof EndTurnEffect && HAS_MARKER(this.SUPREME_COMMAND_MARKER, effect.player, this)) {
      if (this.supremeCommandCards.cards.length > 0) {
        MOVE_CARDS(store, state, this.supremeCommandCards, effect.player.hand, {
          cards: [...this.supremeCommandCards.cards],
          sourceCard: this,
        });
      }
      REMOVE_MARKER(this.SUPREME_COMMAND_MARKER, effect.player, this);
    }

    // Supreme Command
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      if (opponent.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      const max = Math.min(2, opponent.hand.cards.length);
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        opponent.hand,
        {},
        { min: 0, max, allowCancel: true, isSecret: true }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, opponent.hand, this.supremeCommandCards, {
          cards,
          sourceCard: this,
        });
        ADD_MARKER(this.SUPREME_COMMAND_MARKER, opponent, this);
      });
    }

    // Hydro Impact
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN(player);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 80, targets);
      });
    }

    // Lv.X must be played onto Active
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Inherit previous stage attacks / powers
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          player.showAllStageAbilities = true;
        }
      });
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }
      for (const evolutionCard of cardList.cards) {
        if (
          evolutionCard.superType === SuperType.POKEMON &&
          evolutionCard !== this &&
          evolutionCard.name === this.evolvesFrom
        ) {
          effect.attacks.push(...(evolutionCard.attacks || []));
        }
      }
    }

    if (effect instanceof CheckPokemonPowersEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }
      for (const evolutionCard of cardList.cards) {
        if (
          evolutionCard.superType === SuperType.POKEMON &&
          evolutionCard !== this &&
          evolutionCard.name === this.evolvesFrom
        ) {
          effect.powers.push(...(evolutionCard.powers || []));
        }
      }
    }

    return state;
  }
}
