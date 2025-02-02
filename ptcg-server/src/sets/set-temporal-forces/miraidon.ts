/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CardTag } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, GameError, GameMessage, PlayerType, ShuffleDeckPrompt, SlotType, StateUtils } from '../../game';

export class Miraidon extends PokemonCard {

  public tags = [CardTag.FUTURE];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 110;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Peak Acceleration',
      cost: [CardType.COLORLESS],
      damage: 40,
      text: 'Search your deck for up to 2 Basic Energy cards and attach them to your Future Pokémon in any way you like. Then, shuffle your deck.'
    },
    {
      name: 'Sparking Strike',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.PSYCHIC],
      damage: 160,
      text: ''
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '121';

  public name: string = 'Miraidon';

  public fullName: string = 'Miraidon TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: 2 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {

          const target = StateUtils.getTarget(state, player, transfer.to);

          if (!target.cards[0].tags.includes(CardTag.FUTURE)) {
            throw new GameError(GameMessage.INVALID_TARGET);
          }

          if (target.cards[0].tags.includes(CardTag.FUTURE)) {

            player.deck.moveCardTo(transfer.card, target);
          }
        }

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}