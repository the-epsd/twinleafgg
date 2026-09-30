import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, StateUtils, PowerType, BoardEffect, ChooseCardsPrompt, GameError, GameMessage, PlayerType, ShowCardsPrompt, ShuffleDeckPrompt, SuperType, TrainerType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { EndTurnEffect } from "../../../game/store/effects/game-phase-effects";
import { PlayPokemonEffect } from "../../../game/store/effects/play-card-effects";
import { IS_ABILITY_BLOCKED, MOVE_CARDS, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED, WAS_POWER_USED } from "../../../game/store/prefabs/prefabs";

export class MegaLucarioZex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Riolu';
  protected _tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType[] = [M];
  public hp: number = 330;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Aura Seeker',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may use this Ability. Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Dancing Fist',
    cost: [M, M],
    damage: 120,
    damageCalculation: '+',
    text: "If your opponent's Active Pokémon is a Pokémon ex, this attack does 120 more damage.",
  }];

  public regulationMark: string = 'J';
  public set: string = 'FLO';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Lucario Z ex';
  public fullName: string = 'Mega Lucario Z ex FLO';

  public readonly AURA_SEEKER_MARKER = 'AURA_SEEKER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defending = opponent.active.getPokemonCard();

      if (defending && defending.hasTag(CardTag.POKEMON_ex)) {
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 120);
      }
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.AURA_SEEKER_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.AURA_SEEKER_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.AURA_SEEKER_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.AURA_SEEKER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this, sourceEffect: this.powers[0] });

        if (cards.length > 0) {
          state = store.prompt(state, new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards
          ), () => { });
        }

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          player.marker.addMarker(this.AURA_SEEKER_MARKER, this);
        });
      });
    }

    return state;
  }
}
