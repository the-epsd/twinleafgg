import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, ChooseCardsPrompt, ShowCardsPrompt, ShuffleDeckPrompt, ChooseAttackPrompt, PokemonCardList, Attack, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsMurkrow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Deceit',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Torment',
      cost: [D, C],
      damage: 30,
      text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. During your opponent\'s next turn, that Pokémon can\'t use that attack.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '127';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Murkrow';
  public fullName: string = 'Team Rocket\'s Murkrow DRI';

  public DISABLED_ATTACK: Attack | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Deceit attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        return state;
      }

      // Filter deck to show only Supporter cards
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER)) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 1, allowCancel: true, blocked }
      ), selected => {
        const cards = selected || [];

        if (cards.length === 0) {
          return state;
        }

        // Move card to hand
        player.deck.moveCardsTo(cards, player.hand);

        // Show opponent the revealed card
        return store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards
        ), () => {
          // Shuffle deck
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });
      });
    }

    // Torment attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
      }

      store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_DISABLE,
        [pokemonCard],
        { allowCancel: false }
      ), result => {
        if (!result) {
          return state;
        }

        this.DISABLED_ATTACK = result;

        store.log(state, GameLog.LOG_PLAYER_DISABLES_ATTACK, {
          name: player.name,
          attack: this.DISABLED_ATTACK.name
        });

        opponent.active.marker.addMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);

        return state;
      });

      return state;
    }

    // Prevent opponent from using the disabled attack
    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      if (effect.attack === this.DISABLED_ATTACK) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Clear marker and reset disabled attack on turn end
    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      effect.player.active.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
      this.DISABLED_ATTACK = undefined;
    }

    return state;
  }
}

