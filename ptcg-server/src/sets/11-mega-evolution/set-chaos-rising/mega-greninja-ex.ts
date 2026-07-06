import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  PokemonCard,
  StoreLike,
  State,
  StateUtils,
  ChoosePokemonPrompt,
  GameMessage,
} from '../../../game';
import { PlayerType, SlotType } from '../../../game/store/actions/play-card-action';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import {
  WAS_POWER_USED,
  WAS_ATTACK_USED,
  ABILITY_USED,
  MOVE_CARDS,
  REMOVE_MARKER_AT_END_OF_TURN,
  CONFIRMATION_PROMPT,
  PUT_SPECIFIC_ENERGY_FROM_THIS_POKEMON_INTO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { GameError } from '../../../game/game-error';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';

export class MegaGreninjaex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Frogadier';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public hp: number = 350;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [
    {
      name: 'Mortal Shuriken',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: "Once during your turn, if this Pokémon is in the Active Spot, you may discard a Basic [W] Energy card from your hand in order to use this Ability. Place 6 damage counters on 1 of your opponent's Pokémon. ",
    },
  ];

  public attacks = [
    {
      name: 'Ninja Spinner',
      cost: [W, W],
      damage: 120,
      text: 'You may put a [W] Energy attached to this Pokémon into your hand and have this attack do 80 more damage.',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Mega Greninja ex';
  public fullName: string = 'Mega Greninja ex M4';

  public readonly MORTAL_SHURIKEN_MARKER = 'MORTAL_SHURIKEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-fusion-strike/inteleon-vmax.ts (Double Gunner — discard energy, then choose targets)
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.MORTAL_SHURIKEN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const basicWInHand = player.hand.cards.some(
        (c) =>
          c instanceof EnergyCard &&
          c.energyType === EnergyType.BASIC &&
          c.provides.includes(CardType.WATER),
      );
      if (!basicWInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasOpponentPokemon =
        opponent.active.cards.length > 0 || opponent.bench.some((b) => b.cards.length > 0);
      if (!hasOpponentPokemon) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
          { allowCancel: true, min: 1, max: 1 },
        ),
        (cards) => {
          cards = cards || [];
          if (cards.length === 0) {
            return state;
          }

          MOVE_CARDS(store, state, player.hand, player.discard, {
            cards,
            sourceCard: this,
            sourceEffect: this.powers[0],
          });

          return store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.TOP_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { min: 1, max: 1, allowCancel: false },
            ),
            (selected) => {
              const targets = selected || [];
              if (targets.length > 0) {
                const placeCounters = new PlaceDamageCountersEffect(player, targets[0], 60, this);
                store.reduceEffect(state, placeCounters);
              }
              player.marker.addMarker(this.MORTAL_SHURIKEN_MARKER, this);
              ABILITY_USED(player, this);
            },
          );
        },
      );
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.MORTAL_SHURIKEN_MARKER, this);
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.MORTAL_SHURIKEN_MARKER, this);
    }

    // Ref: set-fusion-strike/inteleon-vmax.ts (Aqua Bullet — optional energy to hand for more damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      CONFIRMATION_PROMPT(
        store,
        state,
        player,
        (result) => {
          if (result) {
            PUT_SPECIFIC_ENERGY_FROM_THIS_POKEMON_INTO_HAND(
              store,
              state,
              effect,
              [CardType.WATER],
              {
                onEnergyMoved: () => {
                  effect.damage += 80;
                },
              },
            );
          }
        },
        GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK,
      );
    }
    return state;
  }
}
