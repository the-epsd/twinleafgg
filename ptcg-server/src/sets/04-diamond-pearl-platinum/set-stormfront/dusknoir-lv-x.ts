import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, GameError, GameMessage, StateUtils, GamePhase, GameLog, SuperType, PlayerType } from "../../../game";
import { CheckTableStateEffect, CheckPokemonAttacksEffect, CheckPokemonPowersEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { KnockOutEffect, PlaceDamageCountersEffect, MoveCardsEffect, UseStadiumEffect } from "../../../game/store/effects/game-effects";
import { BetweenTurnsEffect } from "../../../game/store/effects/game-phase-effects";
import { PlayPokemonEffect } from "../../../game/store/effects/play-card-effects";
import { IS_POKEPOWER_BLOCKED, MOVE_CARDS, TAKE_X_PRIZES, CONFIRMATION_PROMPT } from "../../../game/store/prefabs/prefabs";
import { IS_STADIUM_EFFECT_BLOCKED } from "../../../game/store/prefabs/stadium-effect";

export class DusknoirLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Dusknoir';
  public cardType: CardType[] = [P];
  public hp: number = 140;
  public weakness = [{ type: D }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Ectoplasm',
    powerType: PowerType.POKEPOWER,
    text: 'If Dusknoir is your Active Pokémon and would be Knocked Out by damage from your opponent\'s attack, you may discard all cards attached to Dusknoir LV.X and put Dusknoir LV.X as a Stadium card into play instead of discarding it. This counts as Dusknoir being Knocked Out and your opponent takes a Prize card. As long as you have Dusknoir LV.X as a Stadium card in play, put 1 damage counter on each of your opponent\'s Pokémon between turns. If another Stadium card comes into play or Dusknoir LV.X is discarded by the effects of any attacks, Poké-Powers, Poké-Bodies, Trainer, or Supporter cards, return Dusknoir LV.X to your hand.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Dusknoir';
  public fullName: string = 'Dusknoir LV.X SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Ectoplasm — become a Stadium when Knocked Out by opponent attack damage
    if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target !== player.active) {
        return state;
      }
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
      if (state.players[state.activePlayer] !== opponent) {
        return state;
      }
      if (!player.marker.hasMarker(player.DAMAGE_DEALT_MARKER)) {
        return state;
      }
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Block engine discard until the player resolves the prompt
      effect.preventDefault = true;

      const discardAsNormalKo = () => {
        effect.preventDefault = false;
        const target = effect.target;
        const pokemons = target.getPokemons();
        const tools = [...target.tools];
        const otherCards = target.cards.filter(
          c => !(c instanceof PokemonCard) && !pokemons.includes(c as PokemonCard) && !tools.includes(c)
        );
        if (otherCards.length > 0) {
          MOVE_CARDS(store, state, target, player.discard, { cards: otherCards, sourceCard: this });
        }
        for (const tool of tools) {
          MOVE_CARDS(store, state, target, player.discard, { cards: [tool], sourceCard: this });
        }
        if (pokemons.length > 0) {
          MOVE_CARDS(store, state, target, player.discard, { cards: pokemons, sourceCard: this });
        }
      };

      const applyEctoplasm = () => {
        const target = effect.target;
        const prizeCount = Math.max(1, effect.prizeCount);

        store.log(state, GameLog.LOG_POKEMON_KO, { name: this.name });
        TAKE_X_PRIZES(store, state, opponent, prizeCount);

        // Discard everything attached / under this LV.X, keep only this card
        const tools = [...target.tools];
        for (const tool of tools) {
          MOVE_CARDS(store, state, target, player.discard, { cards: [tool], sourceCard: this });
        }
        const toDiscard = target.cards.filter(c => c !== this);
        if (toDiscard.length > 0) {
          MOVE_CARDS(store, state, target, player.discard, { cards: toDiscard, sourceCard: this });
        }

        // Replace any existing Stadium (Pokemon-as-Stadium returns to hand via helper paths)
        const existingStadium = StateUtils.getStadiumCard(state);
        if (existingStadium !== undefined) {
          const stadiumList = StateUtils.findCardList(state, existingStadium);
          const stadiumOwner = StateUtils.findOwner(state, stadiumList);
          if (existingStadium.superType === SuperType.POKEMON) {
            MOVE_CARDS(store, state, stadiumList, stadiumOwner.hand, {
              cards: [existingStadium],
              sourceCard: this,
            });
          } else if (existingStadium.tags.includes(CardTag.PRISM_STAR)) {
            MOVE_CARDS(store, state, stadiumList, stadiumOwner.lostzone, {
              cards: [existingStadium],
              sourceCard: this,
            });
          } else {
            MOVE_CARDS(store, state, stadiumList, stadiumOwner.discard, {
              cards: [existingStadium],
              sourceCard: this,
            });
          }
        }

        MOVE_CARDS(store, state, target, player.stadium, { cards: [this], sourceCard: this });
        target.clearEffects();
        target.damage = 0;
      };

      return CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          discardAsNormalKo();
          return;
        }
        applyEctoplasm();
      });
    }

    // Stadium between-turns: 1 damage counter on each of opponent's Pokémon
    if (effect instanceof BetweenTurnsEffect && StateUtils.getStadiumCard(state) === this) {
      const stadiumList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, stadiumList);

      // BetweenTurnsEffect runs once per player — only fire for the stadium owner
      if (effect.player !== owner) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        if (cardList.cards.length === 0) {
          return;
        }
        if (IS_STADIUM_EFFECT_BLOCKED(store, state, owner, cardList)) {
          return;
        }
        store.reduceEffect(
          state,
          new PlaceDamageCountersEffect(owner, cardList, 10, this, this.powers[0]),
        );
      });
      return state;
    }

    // Discarded from Stadium by card effects → return to hand.
    // Stadium replacement (another Stadium comes into play) is handled by
    // REMOVE_STADIUM_CARD_LIST in the play-stadium / dual-stadium paths.
    if (effect instanceof MoveCardsEffect && StateUtils.getStadiumCard(state) === this) {
      const stadiumList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, stadiumList);
      const movingThis =
        effect.source === stadiumList &&
        (effect.cards === undefined || effect.cards.includes(this));

      if (movingThis && (effect.destination === owner.discard || effect.destination === owner.lostzone)) {
        effect.destination = owner.hand;
      }
      return state;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    // LV.X inheritance
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
