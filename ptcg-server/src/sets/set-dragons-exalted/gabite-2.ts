import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameMessage, ChooseCardsPrompt, ShowCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  WAS_POWER_USED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED,
  BLOCK_IF_DECK_EMPTY, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK
} from '../../game/store/prefabs/prefabs';

export class Gabite2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gible';
  public cardType: CardType = N;
  public hp: number = 80;
  public weakness = [{ type: N }];
  public retreat = [C];

  public powers = [{
    name: 'Dragon Call',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may search your deck for a Dragon Pokemon, reveal it, and put it into your hand. Shuffle your deck afterward.'
  }];

  public attacks = [
    {
      name: 'Dragonslice',
      cost: [W, F],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gabite';
  public fullName: string = 'Gabite DRX 89';

  public readonly DRAGON_CALL_MARKER = 'DRAGON_CALL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Dragon Call
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_DECK_EMPTY(player);
      USE_ABILITY_ONCE_PER_TURN(player, this.DRAGON_CALL_MARKER, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON, cardType: CardType.DRAGON },
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

        SHUFFLE_DECK(store, state, player);
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DRAGON_CALL_MARKER, this);

    return state;
  }
}
