import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, SpecialCondition, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class LuxrayV extends PokemonCard {

  public cardType = L;

  public tags = [CardTag.POKEMON_V];

  public stage = Stage.BASIC;

  public hp = 210;

  public weakness = [{ type: F }];

  public resistance = [];

  public retreat = [C];

  public attacks = [
    {
      name: 'Fang Snipe',
      cost: [C, C],
      damage: 30,
      text: 'Your opponent reveals their hand. Discard a Trainer card you find there.'
    },
    {
      name: 'Radiating Pulse',
      cost: [L, L, C],
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

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      //const cards = opponent.hand.cards.filter(c => c instanceof TrainerCard);

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        //selected = cards || [];

        opponent.hand.moveCardsTo(selected, opponent.discard);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
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
