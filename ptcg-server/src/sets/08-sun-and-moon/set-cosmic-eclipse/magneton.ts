import { CardType, ChooseCardsPrompt, GameError, GameMessage, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike, SuperType, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, KNOCK_OUT_THIS_POKEMON, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magnemite';
  public hp: number = 80;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Call Signal',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    knocksOutSelf: true,
    text: 'Once during your turn (before your attack), you may search your deck for up to 3 Supporter cards, reveal them, and put them into your hand. Then, shuffle your deck. If you searched your deck in this way, this Pokémon is Knocked Out.',
  }];

  public attacks = [{
    name: 'Magnetic Blast',
    cost: [L, L, C],
    damage: 50,
    text: '',
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Magneton';
  public fullName: string = 'Magneton CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call Signal
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ABILITY_USED(player, this);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 3, allowCancel: true }
      ), selected => {
        const cards = selected || [];

        if (cards.length === 0) {
          SHUFFLE_DECK(store, state, player);
          return KNOCK_OUT_THIS_POKEMON(store, state, player, this);
        }

        MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this, sourceEffect: this.powers[0] });
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        SHUFFLE_DECK(store, state, player);
        return KNOCK_OUT_THIS_POKEMON(store, state, player, this);
      });
    }

    return state;
  }
}
