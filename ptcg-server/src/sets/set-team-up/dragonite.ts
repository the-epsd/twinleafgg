import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameMessage } from '../../game/game-message';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { StateUtils } from '../../game/store/state-utils';

export class Dragonite extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dragonair';
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 160;
  public weakness = [{ type: CardType.FAIRY }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Fast Call',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, (before your attack),  you may search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];
  public attacks = [{
    name: 'Dragon Claw',
    cost: [CardType.WATER, CardType.LIGHTNING, CardType.COLORLESS],
    damage: 120,
    text: ''
  }];

  public set: string = 'TEU';
  public name: string = 'Dragonite';
  public fullName: string = 'Dragonite TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '119';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        store.prompt(state, [new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards
        )], () => {
          player.deck.moveCardsTo(cards, player.hand);
        });
      });

    }
    return state;
  }
}