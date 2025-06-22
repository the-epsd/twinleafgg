import { PokemonCard, Stage, PowerType, StoreLike, State, ChooseCardsPrompt, GameMessage, StateUtils, CardTag, PlayerType, SuperType, GameError, CardList } from '../../game';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { WAS_POWER_USED, BLOCK_EFFECT_IF_MARKER, ADD_MARKER, ABILITY_USED, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, REPLACE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class UxieLVX extends PokemonCard {
  public stage = Stage.LV_X;
  public evolvesFrom = 'Uxie';
  public tags = [CardTag.POKEMON_LV_X];
  public cardType = P;
  public hp = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Trade Off',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may look at the top 2 cards of your deck, choose 1 of them, and put it into your hand. Put the other card on the bottom of your deck. This power can\'t be used if Uxie is affected by a Special Condition. You can\'t use more than 1 Trade Off Poké-Power each turn.'
  }];

  public attacks = [{
    name: 'Zen Blade',
    cost: [C, C],
    damage: 60,
    text: 'Uxie can\'t use Zen Blade during your next turn.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '146';
  public name: string = 'Uxie';
  public fullName: string = 'Uxie Lv. X LA';

  public readonly TRADE_OFF_MARKER = 'TRADE_OFF_MARKER';
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      BLOCK_EFFECT_IF_MARKER(this.TRADE_OFF_MARKER, player, this);
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const deckBottom = new CardList();
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 2);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        {},
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        ADD_MARKER(this.TRADE_OFF_MARKER, player, this);
        ABILITY_USED(player, this);

        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(deckBottom);
        deckBottom.moveTo(player.deck);
        return state;
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.TRADE_OFF_MARKER, this);

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
      ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
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