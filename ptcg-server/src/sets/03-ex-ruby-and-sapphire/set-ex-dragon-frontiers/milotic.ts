import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, CAN_PLAY_SUPPORTER_CARD, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Milotic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Feebas';
  public hp: number = 90;
  public cardType: CardType = R;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [{
    name: 'Sharing',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may look at your opponent\'s hand. You may use the effect of a Supporter card you find there as the effect of this power. (The Supporter card remains in your opponent\'s hand.) You can\'t use more than 1 Sharing Poké-Power each turn. This power can\'t be used if Milotic is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Flare',
    cost: [R, R, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Milotic δ';
  public fullName: string = 'Milotic δ DF';

  public readonly SHARING_MARKER = 'SHARING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sharing
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const supportersInDiscard = opponent.discard.cards.filter(card => {
        return card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER;
      });
      if (!supportersInDiscard || supportersInDiscard.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (HAS_MARKER(this.SHARING_MARKER, player)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      ADD_MARKER(this.SHARING_MARKER, player, this);
      ABILITY_USED(player, this);
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_COPY_EFFECT,
        opponent.discard,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        const trainerCard = cards[0] as TrainerCard;
        if (!CAN_PLAY_SUPPORTER_CARD(store, state, player, trainerCard, true)) {
          return state;
        }
        return state;
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SHARING_MARKER, this);

    return state;
  }
}
