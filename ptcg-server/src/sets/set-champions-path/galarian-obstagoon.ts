import {
  ChooseCardsPrompt,
  GameError, PlayerType,
  PokemonCardList,
  PowerType,
  ShowCardsPrompt,
  State,
  StateUtils,
  StoreLike
} from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { BoardEffect, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class GalarianObstagoon extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public cardType: CardType = CardType.DARK;

  public hp: number = 170;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Wicked Ruler',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may have your opponent discard cards from their hand until they have 4 cards in their hand.'
  }];

  public attacks = [
    {
      name: 'Knuckle Impact',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 180,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'CPA';

  public name: string = 'Galarian Obstagoon';

  public fullName: string = 'Galarian Obstagoon CPA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '37';

  public evolvesFrom = 'Galarian Linoone';

  public readonly WICKED_RULER_MARKER = 'WICKED_RULER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.active.attackMarker.hasMarker(PokemonCardList.ATTACK_USED_2_MARKER, this)) {
      effect.player.active.attackMarker.removeMarker(PokemonCardList.ATTACK_USED_MARKER, this);
      effect.player.active.attackMarker.removeMarker(PokemonCardList.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.active.attackMarker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
      effect.player.active.attackMarker.addMarker(PokemonCardList.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.active.attackMarker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      effect.player.active.attackMarker.addMarker(PokemonCardList.ATTACK_USED_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.attackMarker.removeMarker(this.WICKED_RULER_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const handSize = opponent.hand.cards.length;
      const cardsToRemove = handSize - 4;

      if (handSize <= 4) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.attackMarker.hasMarker(this.WICKED_RULER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }


      return store.prompt(state, new ChooseCardsPrompt(
        opponent,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { min: cardsToRemove, max: cardsToRemove, allowCancel: false }
      ), selected => {
        opponent.hand.moveCardsTo(selected, opponent.discard);

        selected.forEach((card, index) => {
          store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: card.name, effectName: this.powers[0].name });
        });

        store.prompt(state, new ShowCardsPrompt(
          player.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          selected
        ), () => { });

        player.attackMarker.addMarker(this.WICKED_RULER_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        return state;
      });

    }

    if (effect instanceof EndTurnEffect) {

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, player => {
        if (player.cards.includes(this)) {
          player.attackMarker.removeMarker(this.WICKED_RULER_MARKER, this);
        }
      });
    }

    return state;
  }

}
