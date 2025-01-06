import {
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  PlayerType,
  PowerType,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike
} from '../../game';
import { BoardEffect, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Mamoswineex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Piloswine';

  public cardType: CardType = F;

  public hp: number = 340;

  public weakness = [{ type: G }];

  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Mammoth Ride',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for 1 Pokémon, reveal it, and put it into your hand. Then shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Roaring March',
      cost: [F, F],
      damage: 180,
      damageCalculation: '+',
      text: 'This attack does 40 more damage for each of your Benched Stage 2 Pokémon.'
    }
  ];

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Mamoswine ex';

  public fullName: string = 'Mamoswine ex SV9';

  public readonly MAMMOTH_RIDE_MARKER = 'MAMMOTH_RIDE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.MAMMOTH_RIDE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.MAMMOTH_RIDE_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.MAMMOTH_RIDE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

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
          player.marker.addMarker(this.MAMMOTH_RIDE_MARKER, this);
        });
      });
    }

    if (effect instanceof EndTurnEffect) {

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, player => {
        if (player instanceof Mamoswineex) {
          player.marker.removeMarker(this.MAMMOTH_RIDE_MARKER);
        }
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      let stage2Count = 0;
      player.bench.forEach(bench => {
        const pokemon = bench.getPokemonCard();
        if (pokemon && pokemon.stage === Stage.STAGE_2) {
          stage2Count++;
        }
      });

      effect.damage = 180 + (stage2Count * 40);
    }

    return state;
  }
}