import { CardTag, CardType, ChooseCardsPrompt, GameError, GameMessage, PlayerType, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike, SuperType } from "../../../game";
import { CheckTableStateEffect, CheckPokemonAttacksEffect, CheckPokemonPowersEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { PlayPokemonEffect } from "../../../game/store/effects/play-card-effects";
import { HANDLE_ABILITY_BLOCK, IS_ABILITY_LOCKER_IN_PLAY, POKEBODY_TYPES } from "../../../game/store/prefabs/ability-lock";
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED, MOVE_CARDS, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class DialgaGLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  public evolvesFrom = 'Dialga G';
  public cardType: CardType[] = [M];
  protected _tags = [CardTag.POKEMON_LV_X, CardTag.POKEMON_SP];
  public hp: number = 120;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Time Crystal',
    powerType: PowerType.POKEBODY,
    text: "Each Pokémon (both yours and your opponent's) (excluding Pokémon SP) can't use any Poké-Bodies.",
  }];

  public attacks = [{
    name: 'Remove Lost',
    cost: [M, M, C, C],
    damage: 80,
    text: 'Flip a coin until you get tails. For each heads, remove an Energy card attached to the Defending Pokémon and put it in the Lost Zone.',
  }];

  public set: string = 'PL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '122';
  public name: string = 'Dialga G';
  public fullName: string = 'Dialga G LV.X PL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    HANDLE_ABILITY_BLOCK(
      effect,
      ({ player, card }) => {
        if (card.hasTag(CardTag.POKEMON_SP)) {
          return false;
        }
        const cardList = StateUtils.findCardList(state, this);
        const owner = StateUtils.findOwner(state, cardList);
        if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
          return false;
        }
        return IS_ABILITY_LOCKER_IN_PLAY(state, player, this);
      },
      {
        powerTypes: POKEBODY_TYPES,
        error: GameMessage.BLOCKED_BY_ABILITY,
      },
    );

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let numFlips = 0;

      return COIN_FLIP_PROMPT(store, state, player, result => {
          if (result === true) {
            numFlips++;
            return this.reduceEffect(store, state, effect);
          }

          if (numFlips === 0) {
            return state;
          }

          return store.prompt(
            state,
            new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
              opponent.active,
              { superType: SuperType.ENERGY },
              { min: 0, max: numFlips, allowCancel: false },
            ),
            (selected) => {
              const cards = selected || [];
              if (cards.length > 0) {
                MOVE_CARDS(store, state, opponent.active, opponent.lostzone, { cards: cards });
              }
              return state;
            },
          );
        },
      );
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

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
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
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
