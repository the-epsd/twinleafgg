import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, TrainerCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Garbodor extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Trubbish';

  public cardType: CardType = D;

  public hp: number = 120;

  public weakness = [{ type: F }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Suffocating Gas',
      cost: [D],
      damage: 50,
      damageCalculation: 'x',
      text: 'Discard any number of Pokémon Tool cards from your hand. ' +
        'This attack does 50 damage for each card you discarded in this way. '
    },
    {
      name: 'Venomous Hit',
      cost: [D, C, C],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Poisoned.'
    },
  ];

  public set: string = 'PAR';

  public name: string = 'Garbodor';

  public fullName: string = 'Garbodor PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '117';

  public regulationMark: string = 'G';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      const blocked = player.hand.cards
        .filter(c => c instanceof TrainerCard && c.trainerType !== TrainerType.TOOL)
        .map(c => player.hand.cards.indexOf(c));

      // Prompt player to choose cards to discard 
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.TRAINER },
        { allowCancel: false, min: 0, blocked }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
        player.hand.moveCardsTo(cards, player.discard);

        // Calculate damage
        const damage = cards.length * 50;
        effect.damage = damage;
        return state;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }

}
