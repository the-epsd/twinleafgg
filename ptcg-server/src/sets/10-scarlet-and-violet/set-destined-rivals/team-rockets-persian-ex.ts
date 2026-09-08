import {
  PokemonCard,
  Stage,
  CardType,
  CardTag,
  StoreLike,
  State,
  GameMessage,
  StateUtils,
  GameError,
  CardList,
  SuperType,
  ShowCardsPrompt,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import {
  ADD_CONFUSION_TO_PLAYER_ACTIVE,
  AFTER_ATTACK,
  SHUFFLE_DECK,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../../game/store/prefabs/copy-attack-prefabs';

export class TeamRocketsPersianex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Team Rocket's Meowth";
  protected _tags = [CardTag.TEAM_ROCKET, CardTag.POKEMON_ex];
  public cardType: CardType[] = [C];
  public hp: number = 260;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Haughty Orders',
      cost: [C, C],
      damage: 0,
      copycatAttack: true,
      text: 'Your opponent reveals the top 10 cards of their deck. You may choose an attack from a Pokemon you find there and use it as this attack. Your opponent shuffles the revealed cards back into their deck.',
    },
    {
      name: 'Slash and Cash',
      cost: [C, C, C],
      damage: 140,
      text: "Your opponent's Active Pokemon is now Confused.",
    },
  ];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = "Team Rocket's Persian ex";
  public fullName: string = "Team Rocket's Persian ex DRI";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      const opponentTop10 = new CardList();
      opponent.deck.moveTo(opponentTop10, Math.min(10, opponent.deck.cards.length));
      const toppedPokemon = opponentTop10.cards.filter(
        (card) => card.superType === SuperType.POKEMON,
      ) as PokemonCard[];

      store.prompt(
        state,
        [
          new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, opponentTop10.cards, {
            allowCancel: false,
          }),
          new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_EFFECT, opponentTop10.cards, {
            allowCancel: false,
          }),
        ],
        (results) => {
          opponentTop10.moveTo(opponent.deck);
          SHUFFLE_DECK(store, state, opponent);
        },
      );

      if (toppedPokemon.length === 0) {
        return state;
      }

      return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect as AttackEffect, toppedPokemon, {
        allowCancel: true,
        maxRetries: 3,
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
