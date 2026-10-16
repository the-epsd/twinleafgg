import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class UnownU extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'UNSEEN',
    powerType: PowerType.POKEBODY,
    text: 'As long as Unown U is on your Bench, prevent all effects of attacks, including damage, done by your opponent\'s Pokémon to any Unown on your Bench.'
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [C],
    damage: 0,
    text: 'Search your deck for any 1 card and discard it. Shuffle your deck afterward.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Unown [U]';
  public fullName: string = 'Unown [U] LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // UNSEEN
    if (effect instanceof AbstractAttackEffect) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      const sourceOwner = StateUtils.findOwner(state, effect.source);
      if (sourceOwner === targetOwner) {
        return state;
      }
      if (targetOwner.bench.indexOf(effect.target) === -1) {
        return state;
      }
      const targetCard = effect.target.getPokemonCard();
      if (!targetCard?.name.startsWith('Unown')) {
        return state;
      }
      if (!targetOwner.bench.some(b => b.getPokemonCard() === this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, targetOwner, this)) {
        return state;
      }
      effect.preventDefault = true;
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.deck,
        {},
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, player.deck, player.discard, { cards, sourceCard: this, sourceEffect: effect });
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
