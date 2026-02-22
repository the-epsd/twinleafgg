import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State, GameError, GameMessage, AttachEnergyPrompt, EnergyType, PlayerType, SlotType, StateUtils, SuperType, BoardEffect } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Blazikenex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Combusken';
  public cardType: CardType = R;
  public hp: number = 320;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Seething Spirit',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may attach a Basic Energy card from your discard pile to 1 of your Pokémon.'
  }];

  public attacks = [{
    name: 'Burning Assault',
    cost: [R, C],
    damage: 200,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];

  public regulationMark = 'H';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Blaziken ex';
  public fullName: string = 'Blaziken ex JTG';

  public readonly OVERFLOWING_SPIRIT_MARKER = 'OVERFLOWING_SPIRIT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.OVERFLOWING_SPIRIT_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c.superType === SuperType.ENERGY
          && c.energyType === EnergyType.BASIC;
      });

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.OVERFLOWING_SPIRIT_MARKER, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        player.marker.addMarker(this.OVERFLOWING_SPIRIT_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
        return state;
      });
    }

    // Burning Assault
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
