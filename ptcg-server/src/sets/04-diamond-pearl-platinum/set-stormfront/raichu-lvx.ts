import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard, ChooseAttackPrompt, ChooseCardsPrompt, ConfirmPrompt, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { UseAttackEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { AFTER_ATTACK, ADD_MARKER, IS_POKEBODY_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class RaichuLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Raichu';
  public hp: number = 110;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Link Lightning',
    powerType: PowerType.POKEBODY,
    text: 'Once during your turn, when you put Raichu LV.X onto Raichu and use Voltage Shoot, you may use another attack of Raichu afterward. This power can\'t be used if Raichu is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Voltage Shoot',
    cost: [L, L, C],
    damage: 0,
    text: 'Discard 2 Lightning Energy cards from your hand and choose 1 of your opponent\'s Pokémon. This attack does 80 to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Raichu LV.X';
  public fullName: string = 'Raichu LV.X SF';

  public readonly LVX_PLAYED_THIS_TURN_MARKER = 'LVX_PLAYED_THIS_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      ADD_MARKER(this.LVX_PLAYED_THIS_TURN_MARKER, effect.player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.LVX_PLAYED_THIS_TURN_MARKER, this);

    // Link Lightning
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;

      if (!player.marker.hasMarker(this.LVX_PLAYED_THIS_TURN_MARKER, this)) {
        return state;
      }
      if (player.active.specialConditions.length > 0) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const raichuCard = cardList.cards.find(
        c => c.superType === SuperType.POKEMON && c !== this && c.name === 'Raichu',
      ) as PokemonCard | undefined;

      if (!raichuCard?.attacks?.length) {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (!wantToUse) {
          return;
        }
        store.prompt(state, new ChooseAttackPrompt(
          player.id,
          GameMessage.CHOOSE_ATTACK_TO_COPY,
          [raichuCard],
          { allowCancel: true },
        ), attack => {
          if (!attack) {
            return;
          }
          const useAttackEffect = new UseAttackEffect(player, attack);
          useAttackEffect.delegateFrom = raichuCard;
          store.reduceEffect(state, useAttackEffect);
        });
      });
    }

    // Voltage Shoot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const blocked: number[] = [];
      let lightningCount = 0;

      player.hand.cards.forEach((c, index) => {
        if (c instanceof EnergyCard && c.provides.includes(CardType.LIGHTNING)) {
          lightningCount++;
        } else {
          blocked.push(index);
        }
      });

      if (lightningCount < 2) {
        effect.damage = 0;
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { min: 2, max: 2, allowCancel: false, blocked },
      ), selected => {
        const cards = selected || [];
        if (cards.length < 2) {
          effect.damage = 0;
          return;
        }
        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(80, effect, store, state);
      });
    }

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
