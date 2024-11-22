import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Barraskewda extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.WATER;
  public hp: number = 120;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.LIGHTNING }];
  public evolvesFrom = 'Arrokuda';

  public attacks = [{
    name: 'Peck',
    cost: [CardType.COLORLESS],
    damage: 30,
    text: ''
  },
  {
    name: 'Spiral Jet',
    cost: [CardType.WATER],
    damage: 130,
    text: 'Discard 2 [W] Energy cards from your hand. If you don\'t, this attack does nothing.'
  }];

  public set: string = 'RCL';
  public setNumber: string = '53';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Barraskewda';
  public fullName: string = 'Barraskewda RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      let numberOfEnergy = 0;

      player.hand.cards.forEach(card => {
        if (card.superType === SuperType.ENERGY && card.energyType === EnergyType.BASIC && card.name === 'Water Energy') {
          numberOfEnergy++;
        }
      });

      if (numberOfEnergy < 2) {
        effect.damage = 0;
        return state;
      }

      if (numberOfEnergy >= 2) {
        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
          { allowCancel: false, min: 2, max: 2 }
        ), cards => {
          cards = cards || [];

          player.hand.moveCardsTo(cards, player.discard);

          return state;

        });
      }

    }

    return state;
  }
}