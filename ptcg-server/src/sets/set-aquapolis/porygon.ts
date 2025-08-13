import { ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Data Sort',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, choose a Trainer card from your discard pile, show it to your opponent, and then shuffle it into your deck.'
  },
  {
    name: 'Peck',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = 'Porygon';
  public fullName: string = 'Porygon AQ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.discard,
            { superType: SuperType.TRAINER },
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            if (selected) {
              SHOW_CARDS_TO_PLAYER(store, state, opponent, selected)
              MOVE_CARDS(store, state, player.discard, player.deck, { cards: selected, sourceCard: this, sourceEffect: this.attacks[0] });
              SHUFFLE_DECK(store, state, player);
            }
          });
        }
      });
    }

    return state;
  }
}