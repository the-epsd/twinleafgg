import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { ChooseCardsPrompt, GameError, GameMessage } from '../../game';
import { PlayPokemonFromDiscardEffect } from '../../game/store/effects/play-card-effects';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Alomomola extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Gentle Fins',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may put a Basic Pokémon with 70HP or less from your discard pile onto your bench.'
  }];

  public attacks = [{
    name: 'Waterfall',
    cost: [W, C, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Alomomola';
  public fullName: string = 'Alomomola SV11B';

  public readonly GENTLE_FINS_MARKER = 'GENTLE_FINS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.GENTLE_FINS_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.GENTLE_FINS_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (player.marker.hasMarker(this.GENTLE_FINS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.cards[0] !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (openSlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked = player.discard.cards.reduce((acc, c, index) => {
        if (!(c instanceof PokemonCard && c.stage === Stage.BASIC && c.hp <= 70)) {
          acc.push(index);
        }
        return acc;
      }, [] as number[]);

      if (blocked.length === player.discard.cards.length) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const maxPokemons = Math.min(openSlots.length, 1);
      effect.preventDefault = true;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.discard,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 1, max: maxPokemons, allowCancel: false, blocked, maxPokemons }
      ), selectedCards => {
        const cards = selectedCards || [];

        player.marker.addMarker(this.GENTLE_FINS_MARKER, this);

        cards.forEach((card, index) => {
          const playPokemonFromDiscardEffect = new PlayPokemonFromDiscardEffect(player, card as PokemonCard, openSlots[index]);
          store.reduceEffect(state, playPokemonFromDiscardEffect);
        });
        ABILITY_USED(player, this);
      });
    }
    return state;
  }
} 