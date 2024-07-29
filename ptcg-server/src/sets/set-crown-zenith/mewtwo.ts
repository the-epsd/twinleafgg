import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Mewtwo extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 130;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Psypump',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Attach up to 2 [P] Energy cards from your discard pile to 1 of your Pokemon.'
  },
  {
    name: 'Limit Break',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
    damage: 90,
    text: 'If your opponent has 3 or fewer Prize cards remaining, this attack does 90 more damage.'
  }];

  public set: string = 'CRZ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Mewtwo';
  public fullName: string = 'Mewtwo CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack == this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { allowCancel: true, min: 1, max: 2, sameTarget: true },
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
    }
    if (effect instanceof AttackEffect && effect.attack == this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.getPrizeLeft() <= 3) {
        effect.damage += 90;
      }
    }

    return state;
  }
}