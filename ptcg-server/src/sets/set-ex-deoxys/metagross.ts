import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage, PlayerType, EnergyCard, AttachEnergyPrompt, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, MOVE_CARDS, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Metagross extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Metang';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Super Connectivity',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your discard pile for a [P] or [M] Energy card and attach it to your Active Pokémon. Then, put 1 damage counter on that Pokémon. This power can\'t be used if Metagross is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Link Blast',
    cost: [P, C],
    damage: 70,
    text: 'If Metagross and the Defending Pokémon have a different amount of Energy attached to them, this attack\'s base damage is 40 instead of 70.'
  }];

  public set: string = 'DX';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Metagross';
  public fullName: string = 'Metagross DX';

  public readonly SUPER_CONNECTIVITY_MARKER = 'SUPER_CONNECTIVITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.SUPER_CONNECTIVITY_MARKER, player, this);
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SUPER_CONNECTIVITY_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c.superType === SuperType.ENERGY
          && ((c as EnergyCard).provides.includes(CardType.PSYCHIC) || (c as EnergyCard).provides.includes(CardType.METAL));
      });

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.SUPER_CONNECTIVITY_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY },
        {
          allowCancel: false,
          min: 1,
          max: 1,
          validCardTypes: [CardType.PSYCHIC, CardType.METAL]
        },
      ), transfers => {
        transfers = transfers || [];

        ADD_MARKER(this.SUPER_CONNECTIVITY_MARKER, player, this);
        ABILITY_USED(player, this);

        if (transfers.length === 0) {
          return state;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.powers[0] });
          target.damage += 10;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      if (playerEnergyCount !== opponentEnergyCount) {
        effect.damage = 40;
      }
    }

    return state;
  }
}