import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { Card, ChooseCardsPrompt, GameMessage, PokemonCard, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Luxrayex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom: string = 'Luxio';

  public tags = [CardTag.POKEMON_ex];

  public regulationMark = 'H';

  public cardType: CardType = CardType.LIGHTNING;

  public weakness = [{ type: CardType.FIGHTING }];

  public hp: number = 310;

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Piercing Gaze',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: 'Look at your opponent\'s hand and discard 1 card your find there.'
    },
    {
      name: 'Volt Strike',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING],
      damage: 250,
      text: 'Discard all Energy from this Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';

  public name: string = 'Luxray ex';

  public fullName: string = 'Luxray ex TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length == 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        opponent.hand,
        {},
        { allowCancel: false, min: 0, max: 1 }
      ), selectedCard => {
        const selected = selectedCard || [];
        if (selectedCard === null || selected.length === 0) {
          return;
        }

        opponent.hand.moveCardTo(selected[0], opponent.discard);

        player.supporter.moveCardTo(this, player.discard);

      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

    }

    return state;
  }


}