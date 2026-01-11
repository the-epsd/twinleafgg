import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import {
  PowerType, StoreLike, State,
  StateUtils, PokemonCardList, GameError,
  Card,
  ChooseCardsPrompt,
  PlayerType
} from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Honchkrow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Murkrow';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Darkness Restore',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if Honchkrow is your Active Pokémon and your opponent\'s Bench isn\'t full, you may use this power. Search your opponent\'s discard pile for a Basic Pokémon and put it onto his or her bench. This power can\'t be used if Honchkrow is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Riot',
    cost: [D, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Does 30 damage plus 10 more damage for each Pokémon that isn\'t an evolved Pokémon in play (both yours and your opponent\'s).'
  }];

  public set: string = 'SV';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Honchkrow';
  public fullName: string = 'Honchkrow SV';

  public readonly DARKNESS_RESTORE_MARKER: string = 'DARKNESS_RESTORE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      player.marker.removeMarker(this.DARKNESS_RESTORE_MARKER, this);
      return state;
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const slots: PokemonCardList[] = opponent.bench.filter(b => b.cards.length === 0);

      if (player.marker.hasMarker(this.DARKNESS_RESTORE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER); // Not active
      }

      const openSlots = opponent.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_BASIC_POKEMON_TO_BENCH,
        opponent.discard,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        cards = selected || [];

        cards.forEach((card, index) => {
          MOVE_CARDS(store, state, opponent.discard, slots[index], { cards: [card], sourceCard: this, sourceEffect: this.powers[0] });
          slots[index].pokemonPlayedTurn = state.turn;
        });

        // Operation canceled by the user
        if (cards.length === 0) {
          return state;
        }

        player.marker.addMarker(this.DARKNESS_RESTORE_MARKER, this);
        ABILITY_USED(player, this);
      });

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = (effect as EndTurnEffect).player;
      player.marker.removeMarker(this.DARKNESS_RESTORE_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let unevolvedCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (!list.isEvolved()) {
          unevolvedCount++;
        }
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card) => {
        if (!list.isEvolved()) {
          unevolvedCount++;
        }
      });

      effect.damage += 10 * unevolvedCount;
    }

    return state;
  }

}
