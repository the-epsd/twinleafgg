import { Card, PokemonCard, Stage, StoreLike, State, StateUtils, GameError, GameMessage, ChooseCardsPrompt, SuperType } from '../../game';
import { PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, COIN_FLIP_PROMPT, HAS_MARKER, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Noctowl extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Hoothoot';
  public cardType = C;
  public hp = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public powers = [{
    name: 'Glaring Gaze',
    powerType: PowerType.POKEMON_POWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, look at your opponent\'s hand. If your opponent has any Trainer cards there, choose 1 of them. Your opponent shuffles that card into his or her deck. This power can\'t be used if Noctowl is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Wing Attack',
    cost: [C, C, C],
    damage: 30,
    text: ''
  },];

  public set = 'N1';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Noctowl';
  public fullName = 'Noctowl N1';

  public readonly GAZE_MARKER = 'GAZE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.GAZE_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);
      ADD_MARKER(this.GAZE_MARKER, player, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const opponent = StateUtils.getOpponent(state, player);

          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_SHUFFLE,
            opponent.hand,
            { superType: SuperType.TRAINER },
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            cards = selected || [];
            MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards });
            SHUFFLE_DECK(store, state, opponent);
          });
        }
      });
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.GAZE_MARKER, this);

    return state;
  }

}
