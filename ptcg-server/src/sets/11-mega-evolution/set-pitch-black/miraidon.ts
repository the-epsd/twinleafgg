import {
  AttachEnergyPrompt,
  GameMessage,
  PlayerType,
  PowerType,
  PokemonCardList,
  SlotType,
  StateUtils,
  StoreLike,
  State,
} from '../../../game';
import { Card } from '../../../game/store/card/card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { Effect } from '../../../game/store/effects/effect';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { IS_ABILITY_BLOCKED, MOVE_CARDS, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Miraidon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Photon Code',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from 1 of your opponent\'s Pokémon\'s attacks, move 2 Basic [L] Energy from this Pokémon to 1 of your Benched Pokémon.',
  }];

  public attacks = [{
    name: 'Thunder',
    cost: [L, L],
    damage: 90,
    text: 'This Pokémon also does 30 damage to itself.',
  }];

  public set: string = 'M5';
  public setNumber: string = '27';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Miraidon';
  public fullName: string = 'Miraidon M5';

  private isEligibleBasicLightningEnergy(card: Card): card is EnergyCard {
    return card instanceof EnergyCard
      && card.energyType === EnergyType.BASIC
      && card.provides.some(p =>
        p === CardType.LIGHTNING || p === CardType.ANY || p === CardType.WLFM,
      );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-paradox-rift/veluza.ts (Filet Memento)
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      if (effect.target !== player.active) {
        return state;
      }

      if (!player.marker.hasMarker(player.DAMAGE_DEALT_MARKER)) {
        return state;
      }

      if (!IS_ABILITY_BLOCKED(store, state, player, this)) {

        const activeCopy = new PokemonCardList();
        activeCopy.cards = effect.target.cards.slice();

        const blocked = activeCopy.cards
          .map((c, idx) => (this.isEligibleBasicLightningEnergy(c) ? -1 : idx))
          .filter(idx => idx >= 0);

        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          activeCopy,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY },
          {
            blocked,
            validCardTypes: [CardType.LIGHTNING, CardType.ANY, CardType.WLFM],
            allowCancel: false,
            min: 0,
            max: 2,
          },
        ), transfers => {
          transfers = transfers || [];
          let moved = 0;
          for (const transfer of transfers) {
            if (!transfer || !this.isEligibleBasicLightningEnergy(transfer.card)) {
              continue;
            }
            if (moved >= 2) {
              break;
            }
            const target = StateUtils.getTarget(state, player, transfer.to);
            state = MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card] });
            moved += 1;
          }
        });
      }

    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}
