import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, EnergyCard, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Frosmoth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Snom';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Ice Dance',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may attach a [W] Energy card from your hand to 1 of your Benched [W] Pokémon.'
  }];

  public attacks = [
    {
      name: 'Aurora Beam',
      cost: [W, C],
      damage: 30,
      text: ''
    }
  ];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Frosmoth';
  public fullName: string = 'Frosmoth SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.WATER);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let hasWaterPokemonOnBench = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonTypeEffect);
        if (checkPokemonTypeEffect.cardTypes.includes(CardType.WATER)) {
          hasWaterPokemonOnBench = true;
        }
      });

      if (!hasWaterPokemonOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const checkTransferTypeEffect = new CheckPokemonTypeEffect(target);
          store.reduceEffect(state, checkTransferTypeEffect);
          if (!checkTransferTypeEffect.cardTypes.includes(CardType.WATER)) {
            throw new GameError(GameMessage.INVALID_TARGET);
          }
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });
    }

    return state;
  }

}
