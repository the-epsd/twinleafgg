import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';

export class Whimsicott extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cottonee';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [];

  public attacks = [
    {
      name: 'Helping Hand',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a basic Energy card and attach it to 1 of your Benched Pokémon. Shuffle your deck afterward.'
    },
    {
      name: 'Cotton Guard',
      cost: [G],
      damage: 30,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 30 (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Whimsicott';
  public fullName: string = 'Whimsicott EPO';

  public readonly COTTON_GUARD_MARKER = 'WHIMSICOTT_COTTON_GUARD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        SHUFFLE_DECK(store, state, player);
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        if (cards && cards.length > 0) {
          return store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_BENCH,
            player.deck,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: false, min: 0, max: 1 }
          ), transfers => {
            for (const transfer of transfers || []) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.deck.moveCardTo(cards[0], target);
            }
            SHUFFLE_DECK(store, state, player);
          });
        } else {
          SHUFFLE_DECK(store, state, player);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.marker.addMarker(this.COTTON_GUARD_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.target.marker.hasMarker(this.COTTON_GUARD_MARKER, this)) {
      effect.damage = Math.max(0, effect.damage - 30);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.COTTON_GUARD_MARKER, this);
    }

    return state;
  }
}
