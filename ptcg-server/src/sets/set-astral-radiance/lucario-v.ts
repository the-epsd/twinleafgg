import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { Card, ChooseCardsPrompt, EnergyCard, GameMessage } from '../../game';


export class LucarioV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.FIGHTING;

  public regulationMark = 'F';

  public hp: number = 210;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Crushing Punch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
    },
    {
      name: 'Cyclone Kick',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '78';

  public name: string = 'Lucario V';

  public fullName: string = 'Lucario V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const specialEnergy = opponent.active.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL);

      if (specialEnergy.length === 0) {
        return state;
      }

      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];

        if (cards.length > 0) {
          opponent.active.moveCardsTo(cards, opponent.discard);
        }
      });
    }
    return state;
  }
}