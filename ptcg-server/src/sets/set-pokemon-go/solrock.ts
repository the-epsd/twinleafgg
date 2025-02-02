import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, AttachEnergyPrompt, EnergyCard, GameError, PlayerType, SlotType, StateUtils, PowerType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Solrock extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 90;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Sun Energy',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may attach a P Energy card from your discard pile to 1 of your Lunatone.'
  }];

  public attacks = [
    {
      name: 'Spinning Attack',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 50,
      text: ''
    }];

  public set: string = 'PGO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';

  public name: string = 'Solrock';

  public fullName: string = 'Solrock PGO';

  public readonly SUN_ENERGY_MARKER = 'SUN_ENERGY_MARKER';

  // BEGIN: abpxx6d04wxr
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SUN_ENERGY_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.PSYCHIC);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.SUN_ENERGY_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const blocked: number[] = [];
      player.bench.forEach((card, index) => {
        if (!(card instanceof PokemonCard && card.name === 'Lunatone')) {
          blocked.push(index);
        }
      });
      player.active.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard && card.name === 'Lunatone')) {
          blocked.push(index);
        }
      });

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { allowCancel: true, min: 1, max: 1, blocked: blocked }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          // if (target.getPokemonCard()?.name !== 'Lunatone') {
          //   throw new GameError(GameMessage.INVALID_TARGET);
          // }
          player.discard.moveCardTo(transfer.card, target);
          player.marker.addMarker(this.SUN_ENERGY_MARKER, this);

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });

        }
      }
      );
      // END: abpxx6d04wxr

      // BEGIN: ed8c6549bwf9
      if (effect instanceof EndTurnEffect) {
        effect.player.marker.removeMarker(this.SUN_ENERGY_MARKER, this);
      }
      return state;
      // END: ed8c6549bwf9
    }
    return state;
  }
}
