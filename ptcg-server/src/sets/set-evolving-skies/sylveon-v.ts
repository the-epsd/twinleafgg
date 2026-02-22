import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PowerType, ShuffleDeckPrompt, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class SylveonV extends PokemonCard {

  public tags = [CardTag.POKEMON_V, CardTag.RAPID_STRIKE];

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 200;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Dream Gift',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, you may search your deck for an Item card, reveal it, and put it into your hand. Then, shuffle your deck. If you use this Ability, your turn ends.'
    }
  ];

  public attacks =
    [
      {
        name: 'Magical Shot',
        cost: [CardType.COLORLESS, CardType.COLORLESS],
        damage: 60,
        text: ''
      }
    ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public name: string = 'Sylveon V';

  public fullName: string = 'Sylveon V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        MOVE_CARDS(store, state, player.deck, player.hand, { cards: cards, sourceCard: this, sourceEffect: this.powers[0] });

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

        const endTurnEffect = new EndTurnEffect(player);
        store.reduceEffect(state, endTurnEffect);
        return state;
      });
      return state;
    }
    return state;
  }
}

