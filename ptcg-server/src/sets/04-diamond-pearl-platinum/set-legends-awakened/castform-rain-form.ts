import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, GameLog, PowerType, State, StateUtils, StoreLike, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

function isCastformPokemon(card: PokemonCard): boolean {
  return card.name === 'Castform' || card.name.includes('Castform');
}

export class CastformRainForm extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Temperament',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your deck for any Castform and switch it with Castform Rain Form. (Any cards attached to Castform Rain Form, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) Shuffle Castform Rain Form back into your deck. You can\'t use more than 1 Temperament Poké-Power each turn.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Water Pulse',
    cost: [W, C],
    damage: 30,
    text: 'The defending Pokémon is now Asleep.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Castform Rain Form';
  public fullName: string = 'Castform Rain Form LA';

  public readonly TEMPERAMENT_MARKER = 'TEMPERAMENT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect && HAS_MARKER(this.TEMPERAMENT_MARKER, effect.player)) {
      REMOVE_MARKER(this.TEMPERAMENT_MARKER, effect.player);
    }

    // Temperament
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const targetCardList = StateUtils.findCardList(state, this);
      if (!(targetCardList instanceof PokemonCardList)) {
        throw new GameError(GameMessage.INVALID_TARGET);
      }

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (HAS_MARKER(this.TEMPERAMENT_MARKER, player)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) || !isCastformPokemon(card)) {
          blocked.push(index);
        }
      });

      state = store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          player.deck,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: true, blocked },
        ),
        (selection) => {
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
          MOVE_CARDS(store, state, player.deck, targetCardList, { cards: [pokemonCard], sourceCard: this });
          MOVE_CARDS(store, state, targetCardList, player.deck, { cards: [this], sourceCard: this });

          SHUFFLE_DECK(store, state, player);
          ADD_MARKER(this.TEMPERAMENT_MARKER, player, this);
          ABILITY_USED(player, this);
        },
      );
    }

    // Water Pulse
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
