import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, GameError, GameMessage, EnergyType, PlayerType, AttachEnergyPrompt, SlotType, SuperType, PowerType, StateUtils } from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class TeamRocketsSpidops extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Team Rocket\'s Tarountula';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Charge Up',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may attach 1 Basic Energy from your discard pile to this Pokémon.'
  }];

  public attacks = [
    {
      name: 'Rocket Rush',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: 'This attack does 30 damage for each of your Team Rocket\'s Pokemon in play.'
    }
  ];

  public tags = [CardTag.TEAM_ROCKET];

  public set: string = 'SV10';

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '9';

  public name: string = 'Team Rocket\'s Spidops';

  public fullName: string = 'Team Rocket\'s Spidops SV10';

  public readonly CHARGE_UP_MARKER = 'CHARGE_UP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.CHARGE_UP_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC;
      });

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.CHARGE_UP_MARKER, this)) {
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
        player.marker.addMarker(this.CHARGE_UP_MARKER, this);
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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Count Team Rocket's Pokemon in play
      const player = effect.player;
      let teamRocketCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (card.tags.includes(CardTag.TEAM_ROCKET)) {
          teamRocketCount++;
        }
      });

      // Modify damage based on count
      effect.damage = 30 * teamRocketCount;
    }

    return state;
  }
}
