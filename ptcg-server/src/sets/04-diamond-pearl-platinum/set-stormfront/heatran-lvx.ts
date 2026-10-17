import { PokemonCard, getPokemonCardTypes } from '../../../game/store/card/pokemon-card';
import { Card } from '../../../game/store/card/card';
import { CardTag, CardType, EnergyType, SpecialCondition, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { ChooseCardsPrompt, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckSpecialConditionRemovalEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { BetweenTurnsEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { ABILITY_USED, IS_POKEBODY_BLOCKED, IS_POKEPOWER_BLOCKED, MOVE_CARDS, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class HeatranLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Heatran';
  public hp: number = 120;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Heat Metal',
    powerType: PowerType.POKEBODY,
    text: 'Your opponent can\'t remove the Special Condition Burned by evolving or devolving his or her Burned Pokémon. (This also includes putting a Pokémon Level-Up card onto the Burned Pokémon.) Whenever your opponent flips a coin for the Special Condition Burned between turns, treat it as tails.'
  },
  {
    name: 'Heat Wave',
    powerType: PowerType.POKEPOWER,
    text: 'Once at the end of your turn, if Heatran is on your Bench, you may use this power. If you discarded basic Energy cards attached to your Fire or Metal Active Pokémon by using that Pokémon\'s attack this turn, attach up to 2 of those Energy cards to that Pokémon.',
    useWhenInPlay: true
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Heatran LV.X';
  public fullName: string = 'Heatran LV.X SF';

  public readonly HEAT_WAVE_USED_MARKER = 'HEAT_WAVE_USED_MARKER';

  private static heatWaveDiscardedEnergy = new Map<number, Card[]>();

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Heat Metal
    if (effect instanceof CheckSpecialConditionRemovalEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);
      const isOpponentPokemon =
        opponent.active === effect.target ||
        opponent.bench.includes(effect.target);

      if (isOpponentPokemon && effect.target.specialConditions.includes(SpecialCondition.BURNED)) {
        if (!effect.preservedConditions.includes(SpecialCondition.BURNED)) {
          effect.preservedConditions.push(SpecialCondition.BURNED);
        }
      }
    }

    if (effect instanceof BetweenTurnsEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);
      if (effect.player === opponent && effect.player.active.specialConditions.includes(SpecialCondition.BURNED)) {
        effect.burnFlipResult = false;
      }
    }

    if (effect instanceof DiscardCardsEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      const player = effect.player;
      if (player.active !== effect.target) {
        return state;
      }

      const activeCard = effect.target.getPokemonCard();
      if (!activeCard) {
        return state;
      }

      const types = getPokemonCardTypes(activeCard);
      const isFireOrMetal = types.includes(CardType.FIRE) || types.includes(CardType.METAL);
      if (!isFireOrMetal) {
        return state;
      }

      const basicEnergy = effect.cards.filter(
        c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
      );
      if (basicEnergy.length === 0) {
        return state;
      }

      const existing = HeatranLVX.heatWaveDiscardedEnergy.get(player.id) || [];
      HeatranLVX.heatWaveDiscardedEnergy.set(player.id, [...existing, ...basicEnergy]);
    }

    if (effect instanceof EndTurnEffect) {
      HeatranLVX.heatWaveDiscardedEnergy.delete(effect.player.id);
      effect.player.marker.removeMarker(this.HEAT_WAVE_USED_MARKER, this);
    }

    // Heat Wave
    if (WAS_POWER_USED(effect, 1, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const onBench = player.bench.some(b => b.getPokemonCard() === this);
      if (!onBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.HEAT_WAVE_USED_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const discarded = HeatranLVX.heatWaveDiscardedEnergy.get(player.id) || [];
      const inDiscard = discarded.filter(c => player.discard.cards.includes(c));
      if (inDiscard.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const activeCard = player.active.getPokemonCard();
      if (!activeCard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const types = getPokemonCardTypes(activeCard);
      if (!types.includes(CardType.FIRE) && !types.includes(CardType.METAL)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.marker.addMarker(this.HEAT_WAVE_USED_MARKER, this);
      ABILITY_USED(player, this);

      const maxAttach = Math.min(2, inDiscard.length);
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (!inDiscard.includes(c)) {
          blocked.push(index);
        }
      });
      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.discard,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 1, max: maxAttach, allowCancel: false, blocked },
        ),
        cards => {
          cards = cards || [];
          cards.forEach(card => {
            if (!player.discard.cards.includes(card)) {
              return;
            }
            MOVE_CARDS(store, state, player.discard, player.active, { cards: [card], sourceCard: this });
          });
        },
      );
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
