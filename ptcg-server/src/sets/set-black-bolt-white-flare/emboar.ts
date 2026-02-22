import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, EnergyCard, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Emboar extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Pignite';
  public cardType: CardType = R;
  public hp: number = 180;
  public weakness = [{ type: W }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Inferno Fandango',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may attach a [R] Energy card from your hand to 1 of your Pokémon.'
  }];

  public attacks = [
    {
      name: 'Heat Stamp',
      cost: [R, R, R, C],
      damage: 120,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Emboar';
  public fullName: string = 'Emboar SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c.superType === SuperType.ENERGY
          && c.energyType === EnergyType.BASIC
          && (c as EnergyCard).provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false }
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

    return state;
  }

}
