import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Delcattyex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Skitty';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [];

  public powers = [{
    name: 'Constrain',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may use this power. Each player discards cards until that player has 6 cards in his or her hand. (You discard first.) This power can\'t be used if Delcatty ex is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Upstream',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Search your discard pile for all Energy cards. This attack does 10 damage times the number of Energy cards you find there. Show them to your opponent, and put them on top of your deck. Shuffle your deck afterward.'
  },
  {
    name: 'Tail Slap',
    cost: [C, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Delcatty ex';
  public fullName: string = 'Delcatty ex CG';

  public readonly NIGHT_VISION_MARKER = 'NIGHT_VISION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.NIGHT_VISION_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.NIGHT_VISION_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      // Get player's hand length
      const playerHandLength = player.hand.cards.length;

      // Set discard amount to reach hand size of 6
      const playerDiscardAmount = playerHandLength - 6;

      // Player discards
      if (player.hand.cards.length > 6) {
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          {},
          { min: playerDiscardAmount, max: playerDiscardAmount, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          player.hand.moveCardsTo(cards, player.discard);
        });
      }

      // Get opponent's hand length
      const opponentHandLength = opponent.hand.cards.length;

      // Set discard amount to reach hand size of 6
      const discardAmount = opponentHandLength - 6;

      // Opponent discards second
      if (opponent.hand.cards.length > 6) {
        store.prompt(state, new ChooseCardsPrompt(
          opponent,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.hand,
          {},
          { min: discardAmount, max: discardAmount, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          opponent.hand.moveCardsTo(cards, opponent.discard);
        });
      }

      ADD_MARKER(this.NIGHT_VISION_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energyInDiscard = player.discard.cards.filter(c => c.superType === SuperType.ENERGY);
      effect.damage = energyInDiscard.length * 10;
      MOVE_CARDS(store, state, player.discard, player.deck, { cards: energyInDiscard });
      SHUFFLE_DECK(store, state, player);
    }

    return state;
  }
}