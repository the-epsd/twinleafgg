import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, PlayerType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { WAS_POWER_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

export class Delphox extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Braixen';
  public hp: number = 160;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Flare Magic',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may discard a Basic [R] Energy from your hand in order to use this Ability. Draw cards until you have 7 cards in your hand.'
  }];

  public attacks = [{
    name: 'Energy Storm',
    cost: [R, R],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage times the number of Energy attached to all Pokemon in play.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Delphox';
  public fullName: string = 'Delphox M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const basicRInHand = player.hand.cards.find(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(R)
      );
      if (!basicRInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      player.hand.moveCardTo(basicRInHand, player.discard);
      const toDraw = Math.max(0, 7 - player.hand.cards.length);
      if (toDraw > 0) {
        DRAW_CARDS(player, toDraw);
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let totalEnergy = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkEnergy);
        checkEnergy.energyMap.forEach(em => { totalEnergy += em.provides.length; });
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const checkEnergy = new CheckProvidedEnergyEffect(opponent, cardList);
        store.reduceEffect(state, checkEnergy);
        checkEnergy.energyMap.forEach(em => { totalEnergy += em.provides.length; });
      });
      effect.damage = 30 * totalEnergy;
    }
    return state;
  }
}
