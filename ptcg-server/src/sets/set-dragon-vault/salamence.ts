import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POWER_USED, IS_ABILITY_BLOCKED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../game/store/prefabs/prefabs';
import { REMOVE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';

export class Salamence extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Shelgon';
  public cardType: CardType = N;
  public hp: number = 140;
  public weakness = [{ type: N }];
  public retreat = [C, C];

  public powers = [{
    name: 'Scornful Storm',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may have your opponent discard cards from his or her hand until he or she has 4 cards left in his or her hand.'
  }];

  public attacks = [
    {
      name: 'Shred',
      cost: [R, W, C, C],
      damage: 90,
      text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pok\u00e9mon.'
    }
  ];

  public set: string = 'DRV';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Salamence';
  public fullName: string = 'Salamence DRV';

  public readonly SCORNFUL_STORM_MARKER = 'SCORNFUL_STORM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Scornful Storm
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const handSize = opponent.hand.cards.length;
      if (handSize <= 4) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.SCORNFUL_STORM_MARKER, this);
      ABILITY_USED(player, this);

      const cardsToRemove = handSize - 4;

      return store.prompt(state, new ChooseCardsPrompt(
        opponent,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { min: cardsToRemove, max: cardsToRemove, allowCancel: false }
      ), selected => {
        selected = selected || [];
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards: selected });
        SHOW_CARDS_TO_PLAYER(store, state, player, selected);
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SCORNFUL_STORM_MARKER, this);

    // Attack: Shred
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 90);
    }

    return state;
  }
}
