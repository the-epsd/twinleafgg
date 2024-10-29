import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { EnergyCard, GameMessage, AttachEnergyPrompt, StateUtils } from '../../game';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';


export class Mesprit extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = P;

  public hp: number = 70;

  public weakness = [{ type: D }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [{
    name: 'Heart Fulfilment',
    cost: [C],
    damage: 0,
    text: 'Attach up to 2 Basic P Energy from your hand to your Pokémon in any way you like.'
  }, {
    name: 'Legendary Burst',
    cost: [P, P],
    damage: 160,
    text: 'You can only use this attack if you have Uxie and Azelf on your Bench.'
  }];

  public regulationMark = 'H';

  public set: string = 'SSP';

  public setNumber: string = '79';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Mesprit';

  public fullName: string = 'Mesprit SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.PSYCHIC);
      });
      if (!hasEnergyInHand) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { min: 0, max: 2, allowCancel: false }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let isUxieInPlay = false;
      let isAzelfInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Uxie') {
          isUxieInPlay = true;
        }
        if (card.name === 'Azelf') {
          isAzelfInPlay = true;
        }
      });

      if (!isUxieInPlay) {
        effect.damage = 0;
        return state;
      }

      if (!isAzelfInPlay) {
        effect.damage = 0;
        return state;
      }

      if (!isUxieInPlay && !isAzelfInPlay) {
        effect.damage = 0;
        return state;
      }

      return state;
    }

    return state;
  }

}
