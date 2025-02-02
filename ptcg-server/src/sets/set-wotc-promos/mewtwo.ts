import { AttachEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, SlotType, State, StateUtils } from '../../game';
import { StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Mewtwo extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Energy Absorption',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Choose up to 2 Energy cards from your discard pile and attach them to Mewtwo.'
    },
    {
      name: 'Psyburn',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'PR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public name: string = 'Mewtwo';

  public fullName: string = 'Mewtwo PR';

  reduceEffect(store: StoreLike, state: State, effect: Effect) {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.PSYCHIC);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 2 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });

      return state;
    }
    return state;
  }
}