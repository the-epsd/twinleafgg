import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, SpecialCondition, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, TrainerCard, ChooseCardsPrompt, GameMessage } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class LuxrayV extends PokemonCard {

  public cardType = CardType.LIGHTNING;

  public tags = [CardTag.POKEMON_V];

  public stage = Stage.BASIC;

  public hp = 210;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Fang Snipe',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Your opponent reveals their hand. Discard a Trainer card you find there.'
    },
    {
      name: 'Radiating Pulse',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 120,
      text: 'Discard 2 Energy from this Pokémon. Your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Luxray V';

  public fullName: string = 'Luxray V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const cards = opponent.hand.cards.filter(c => c instanceof TrainerCard);

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        selected = cards || [];

        opponent.hand.moveCardsTo(cards, opponent.discard);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergy);

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        selected = selected || [];

        player.active.moveCardsTo(selected, player.discard);
      });

      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
      store.reduceEffect(state, specialConditionEffect);

      return state;
    }
    return state;
  }
}
