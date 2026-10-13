import {
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  PlayerType,
  PowerType,
  SlotType,
  Stage,
  StateUtils,
  StoreLike,
  State,
  SuperType,
} from '../../../game';
import { CardType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Greninja extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Frogadier';
  public hp: number = 130;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Water Shuriken',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: "Once during your turn (before your attack), you may discard a [W] Energy card from your hand. If you do, put 3 damage counters on 1 of your opponent's Pokémon.",
  }];

  public attacks = [{
    name: 'Mist Slash',
    cost: [W],
    damage: 50,
    shredAttack: true,
    text: "This attack's damage isn't affected by Weakness, Resistance, or any other effects on your opponent's Active Pokémon. ",
  }];

  public set: string = 'XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Greninja';
  public fullName: string = 'Greninja XY';

  public readonly WATER_SHURIKEN_MARKER = 'WATER_SHURIKEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.WATER_SHURIKEN_MARKER, this);
    }

    // Water Shuriken
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.WATER_SHURIKEN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      let waterInHand = false;
      player.hand.cards.forEach((card) => {
        if (card.superType === SuperType.ENERGY && card.name === 'Water Energy') {
          waterInHand = true;
        }
      });
      if (!waterInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
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
          player.marker.addMarker(this.WATER_SHURIKEN_MARKER, this);
          MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: this });

          return store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.TOP_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { allowCancel: false },
            ),
            (result) => {
              const target = result[0];
              store.reduceEffect(
                state,
                new PlaceDamageCountersEffect(player, target, 30, this, this.powers[0]),
              );
              return state;
            },
          );
        },
      );

      return state;
    }

    // Mist Slash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 50);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    if (
      effect instanceof EndTurnEffect &&
      effect.player.marker.hasMarker(this.WATER_SHURIKEN_MARKER, this)
    ) {
      effect.player.marker.removeMarker(this.WATER_SHURIKEN_MARKER, this);
    }
    return state;
  }
}
