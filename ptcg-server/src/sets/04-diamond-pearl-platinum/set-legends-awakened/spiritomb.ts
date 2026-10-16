import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, ConfirmPrompt, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Spiritomb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [P];
  public weakness = [];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Curse Breath',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Spiritomb from your hand onto your Bench, you may put 1 damage counter on all Pokémon that already have any damage counters on them (both yours and your opponent\'s). You can\'t use more than 1 Curse Breath Poké-Power each turn.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Transfer Pain',
    cost: [P],
    damage: 0,
    text: 'Move 1 damage counter from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Spiritomb';
  public fullName: string = 'Spiritomb LA';

  public readonly CURSE_BREATH_TURN_MARKER = 'CURSE_BREATH_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Curse Breath
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this
      && effect.target !== effect.player.active) {
      const player = effect.player;
      if (player.marker.hasMarker(`${this.CURSE_BREATH_TURN_MARKER}_${state.turn}`)) {
        return state;
      }
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }
      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (!wantToUse) {
          return;
        }
        player.marker.addMarker(`${this.CURSE_BREATH_TURN_MARKER}_${state.turn}`, this);
        const opponent = StateUtils.getOpponent(state, player);
        const applyCounters = (p: typeof player, playerType: PlayerType) => {
          p.forEachPokemon(playerType, (cardList) => {
            if (cardList.damage > 0) {
              store.reduceEffect(
                state,
                new PlaceDamageCountersEffect(player, cardList, 10, this, this.powers[0]),
              );
            }
          });
        };
        applyCounters(player, PlayerType.BOTTOM_PLAYER);
        applyCounters(opponent, PlayerType.TOP_PLAYER);
      });
    }

    // Transfer Pain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let sourceList: PokemonCardList | null = null;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.damage > 0) {
          sourceList = cardList;
        }
      });
      if (!sourceList) {
        return state;
      }
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false },
      ), targetTargets => {
        if (!targetTargets || targetTargets.length === 0) {
          return;
        }
        sourceList!.damage -= 10;
        const putCounters = new PutCountersEffect(effect, 10);
        putCounters.target = targetTargets[0];
        store.reduceEffect(state, putCounters);
      });
    }

    return state;
  }
}
