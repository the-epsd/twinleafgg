import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, PlayerType, SlotType, GameError, ChoosePokemonPrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class GreninjaXY extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Frogadier';

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Water Shuriken',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard a [W] Energy card from your hand. If you do, put 3 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Mist Slash',
      cost: [CardType.WATER],
      damage: 50,
      text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on your opponent\'s Active Pokémon. '
    }
  ];

  public set: string = 'XY';

  public setNumber = '41';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Greninja';

  public fullName: string = 'Greninja XY';

  public readonly WATER_SHURIKEN_MARKER = 'WATER_SHURIKEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.WATER_SHURIKEN_MARKER, this);
    }

    // Water Shuriken
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // Check marker
      if (player.marker.hasMarker(this.WATER_SHURIKEN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      let waterInHand = false;
      player.hand.cards.forEach(card => {
        if (card.superType === SuperType.ENERGY && card.name === 'Water Energy') {
          waterInHand = true;
        }
      });
      if (!waterInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, name: 'Water Energy' },
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        player.marker.addMarker(this.WATER_SHURIKEN_MARKER, this);
        player.hand.moveCardsTo(cards, player.discard);

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ), result => {
          const target = result[0];
          target.damage += 30;
          return state;
        });
      });

      return state;
    }

    // Mist Slash
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.damage > 0) {
        opponent.active.damage += effect.damage;
        const afterDamage = new AfterDamageEffect(effect, effect.damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.WATER_SHURIKEN_MARKER, this);
    }
    return state;
  }
}