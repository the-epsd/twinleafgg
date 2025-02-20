import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Stantler extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Screechy Voice',
    cost: [C],
    damage: 10,
    text: 'If the Defending Pokémon is an Evolved Pokémon, the Defending Pokémon is now Confused.'
  },
  {
    name: 'Push Away',
    cost: [C, C],
    damage: 20,
    text: 'Look at your opponent\'s hand, choose a Trainer card you find there, and discard it.'
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Stantler';
  public fullName: string = 'Stantler UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (effect.target.stage !== Stage.BASIC) {
        effect.target.addSpecialCondition(SpecialCondition.CONFUSED);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        { superType: SuperType.TRAINER },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        opponent.hand.moveCardsTo(cards, opponent.discard);
      });
    }

    return state;
  }
}