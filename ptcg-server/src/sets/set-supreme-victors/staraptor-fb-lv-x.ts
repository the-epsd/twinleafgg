import { PokemonCard, Stage, PowerType, StoreLike, State, ChooseCardsPrompt, GameMessage, StateUtils, CardTag, PlayerType, SuperType, GameError, TrainerType, ConfirmPrompt } from '../../game';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DISCARD_A_STADIUM_CARD_IN_PLAY } from '../../game/store/prefabs/attack-effects';
import { WAS_POWER_USED, BLOCK_EFFECT_IF_MARKER, BLOCK_IF_DECK_EMPTY, SHOW_CARDS_TO_PLAYER, MOVE_CARD_TO, ADD_MARKER, ABILITY_USED, SHUFFLE_DECK, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, BLOCK_IF_HAS_SPECIAL_CONDITION } from '../../game/store/prefabs/prefabs';

export class StaraptorFBLVX extends PokemonCard {

  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Staraptor FB';
  public tags = [CardTag.POKEMON_SP];
  public cardType = C;
  public hp = 100;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Fast Call',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may search your deck for a Supporter card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Staraptor FB is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Defog',
    cost: [C, C, C],
    damage: 40,
    text: 'Before doing damage, you may discard any Stadium card in play. If you do, this attack\'s base damage is 70 instead of 40.'
  }];

  public set: string = 'SV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '147';
  public name: string = 'Staraptor FB Lv. X';
  public fullName: string = 'Staraptor FB Lv. X SV';

  public readonly FAST_CALL_MARKER = 'FAST_CALL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_EFFECT_IF_MARKER(this.FAST_CALL_MARKER, player, this);
      BLOCK_IF_DECK_EMPTY(player);
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 1 }
      ), cards => {
        if (!cards || cards.length === 0) {
          return state;
        }

        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
        ADD_MARKER(this.FAST_CALL_MARKER, player, this);
        ABILITY_USED(player, this);
        SHUFFLE_DECK(store, state, player);
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.FAST_CALL_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (StateUtils.getStadiumCard(state) === undefined) { return state; }

      return store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          DISCARD_A_STADIUM_CARD_IN_PLAY(state);
          effect.damage = 70;
        }
      });
    }

    //Lv. X Stuff
    // making sure it gets put on the active pokemon
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) { throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
    }

    // Trying to get all of the previous stage's attacks and powers
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
          player.showAllStageAbilities = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Add attacks from the previous stage to this one
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
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
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Adds the powers from the previous stage
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.powers.push(...(evolutionCard.powers || []));
        }
      }
    }

    return state;
  }
}