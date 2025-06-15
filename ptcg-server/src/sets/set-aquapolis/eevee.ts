import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttachEnergyPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Charge Up',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, search your deck for an Energy card and attach it to Eevee. Shuffle your deck afterward.'
  },
  {
    name: 'Lunge',
    cost: [C],
    damage: 20,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'AQ';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          const player = effect.player;
          return store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_CARDS,
            player.deck,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE],
            { superType: SuperType.ENERGY },
            { allowCancel: false, min: 0, max: 1 },
          ), transfers => {
            transfers = transfers || [];
            // Attach energy if selected
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.deck.moveCardTo(transfer.card, target);
            }

            SHUFFLE_DECK(store, state, player);
          });
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }

}
