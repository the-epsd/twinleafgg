import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  PowerType,
  PokemonCardList,
  GameError,
  ChooseCardsPrompt,
  GameLog,
  GamePhase
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  ABILITY_USED,
  ADD_MARKER,
  HAS_MARKER,
  IS_POKEPOWER_BLOCKED,
  REMOVE_MARKER,
  SHUFFLE_DECK,
  WAS_ATTACK_USED,
  WAS_POWER_USED
} from '../../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';

export class Deoxys extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = M;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Form Change',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may search your deck for another Deoxys and switch it with Deoxys. (Any cards attached to Deoxys, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) If you do, put Deoxys on top of your deck. Shuffle your deck afterward. You can\'t use more than 1 Form Change Poké-Power each turn.'
  }];

  public attacks = [{
    name: 'Delta Reduction',
    cost: [M, C],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done to Deoxys by attacks is reduced by 30 (before applying Weakness and Resistance).'
  }];

  public set: string = 'HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Deoxys';
  public fullName: string = 'Deoxys HP';

  public readonly FORME_CHANGE_MARKER = 'FORME_CHANGE_MARKER';
  public readonly DELTA_REDUCTION_MARKER = 'DELTA_REDUCTION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Shared across all Form Change Poké-Powers; clear by name so a Form Change
    // swap (new card instance) still cleans up the marker.
    if (effect instanceof EndTurnEffect && HAS_MARKER(this.FORME_CHANGE_MARKER, effect.player)) {
      REMOVE_MARKER(this.FORME_CHANGE_MARKER, effect.player);
    }

    // Ref: set-pop-series-4/deoxys-ex.ts (Form Change)
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const targetCardList = StateUtils.findCardList(state, this);
      if (!(targetCardList instanceof PokemonCardList)) {
        throw new GameError(GameMessage.INVALID_TARGET);
      }

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (HAS_MARKER(this.FORME_CHANGE_MARKER, player)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name !== this.name) {
          blocked.push(index);
        }
      });

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: true, blocked },
      ), (selection) => {
        if (selection.length <= 0) {
          return state;
        }

        const pokemonCard = selection[0];
        if (!(pokemonCard instanceof PokemonCard)) {
          return state;
        }

        store.log(state, GameLog.LOG_PLAYER_TRANSFORMS_INTO_POKEMON, {
          name: player.name,
          pokemon: this.name,
          card: pokemonCard.name,
          effect: effect.power.name,
        });
        player.deck.moveCardTo(pokemonCard, targetCardList);
        targetCardList.moveCardTo(this, player.deck);

        SHUFFLE_DECK(store, state, player);
        ADD_MARKER(this.FORME_CHANGE_MARKER, player, this);
        ABILITY_USED(player, this);
      });
    }

    // Refs: set-ex-unseen-forces/teddiursa.ts (opponent-next-turn marker),
    // set-ex-dragon-frontiers/meganium.ts (Delta Reduction / before W&R)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.opponent.marker.addMarker(this.DELTA_REDUCTION_MARKER, this);
    }

    if (effect instanceof DealDamageEffect
      && effect.player.marker.hasMarker(this.DELTA_REDUCTION_MARKER, this)
      && effect.target.getPokemonCard() === this) {
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
      effect.damage -= 30;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.DELTA_REDUCTION_MARKER, this)) {
      effect.player.marker.removeMarker(this.DELTA_REDUCTION_MARKER, this);
    }

    return state;
  }
}
