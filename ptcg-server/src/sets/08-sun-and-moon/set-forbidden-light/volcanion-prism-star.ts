import {
  CardTag,
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  PlayerType,
  PowerType,
  Stage,
  StateUtils,
  StoreLike,
  State,
  SuperType,
} from '../../../game';
import { CardType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class VolcanionPrismStar extends PokemonCard {
  protected _tags = [CardTag.PRISM_STAR];
  public stage: Stage = Stage.BASIC;
  public hp: number = 160;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Jet Geyser',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard a [W] Energy card from your hand. If you do, your opponent switches their Active Pokémon with 1 of their Benched Pokémon.',
  }];

  public attacks = [{
    name: 'Sauna Blast',
    cost: [W, W, W],
    damage: 100,
    text: "This attack does 20 damage to each of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
  }];

  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Volcanion Prism Star';
  public fullName: string = 'Volcanion Prism Star FLI';

  public readonly JET_GEYSER_MARKER = 'JET_GEYSER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.JET_GEYSER_MARKER, this);
    }

    // Jet Geyser
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.JET_GEYSER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      state = store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          { superType: SuperType.ENERGY, name: 'Water Energy' },
          { allowCancel: false, min: 1, max: 1 },
        ),
        (cards) => {
          cards = cards || [];
          player.marker.addMarker(this.JET_GEYSER_MARKER, this);
          MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: this });

          if (!opponent.bench.some((b) => b.cards.length > 0)) {
            return;
          }

          SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            { allowCancel: false },
          );
        },
      );

      return state;
    }

    // Sauna Blast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList !== opponent.active) {
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.JET_GEYSER_MARKER, this);
    }

    return state;
  }
}
