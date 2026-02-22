import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State, PlayerType, SlotType, StateUtils, PokemonCardList, EnergyCard, GameError, AttachEnergyPrompt } from '../../game';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Celebi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Forest Breath',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if Celebi is your Active Pokémon, you may attach a [G] Energy card from your hand to 1 of your Pokémon. This power can\'t be used if Celebi is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Time Circle',
      cost: [G, P, C],
      damage: 30,
      text: 'During your opponent\'s next turn, prevent all damage done to Celebi by attacks from your opponent\'s Stage 1 or Stage 2 Pokémon.'
    }
  ];

  public set: string = 'TM';
  public setNumber: string = '92';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Celebi';
  public fullName: string = 'Celebi TM';

  public readonly FOREST_BREATH_MARKER: string = 'FOREST_BREATH_MARKER';
  public readonly TIME_CIRCLE_MARKER: string = 'TIME_CIRCLE_MARKER';
  public readonly CLEAR_TIME_CIRCLE_MARKER: string = 'CLEAR_TIME_CIRCLE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FOREST_BREATH_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (cardList !== player.active) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard && c.name === 'Grass Energy';
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.FOREST_BREATH_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, name: 'Grass Energy' },
        { allowCancel: true, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];

        ABILITY_USED(player, this);

        // cancelled by user
        if (transfers.length === 0) {
          return;
        }

        player.marker.addMarker(this.FOREST_BREATH_MARKER, this);

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.hand.moveCardTo(transfer.card, target);
        }

      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.TIME_CIRCLE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.TIME_CIRCLE_MARKER)) {
      const card = effect.source.getPokemonCard();
      const stage = card !== undefined ? card.stage : undefined;

      if (stage === Stage.STAGE_1 || stage === Stage.STAGE_2) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.FOREST_BREATH_MARKER, this);

      if (effect.player.marker.hasMarker(this.CLEAR_TIME_CIRCLE_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.TIME_CIRCLE_MARKER, this);
        });
      }
    }

    return state;
  }

}
