import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, ChooseEnergyPrompt, Card, EnergyCard, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
export class Slugma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 70;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Grass Fire',
    cost: [CardType.FIRE],
    damage: 0,
    text: ' Discard a [G] Energy attached to your opponent\'s Active Pokémon.'
  },
  {
    name: 'Ram',
    cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name = 'Slugma';
  public fullName = 'Slugma PRC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.active.cards.some(c => c instanceof EnergyCard && c.provides.includes(CardType.GRASS)) &&
        !opponent.active.cards.some(c => c instanceof EnergyCard && c.provides.includes(CardType.ANY))) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.GRASS, CardType.ANY],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);

        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = opponent.active;
        return store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }

}