import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class DarkKadabra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Abra';
  public hp: number = 50;
  public cardType: CardType = P;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Matter Exchange',
    powerType: PowerType.POKEMON_POWER,
    text: 'Once during your turn (before your attack), you may discard a card from your hand in order to draw a card. This power can\'t be used if Dark Kadabra is Asleep, Confused, or Paralyzed.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Mind Shock',
    cost: [P, P],
    damage: 30,
    text: 'Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
  }];

  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Dark Kadabra';
  public fullName: string = 'Dark Kadabra TR';

  public readonly MATTER_EXCHANGE_MARKER = 'MATTER_EXCHANGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.MATTER_EXCHANGE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.MATTER_EXCHANGE_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.MATTER_EXCHANGE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        ABILITY_USED(player, this);
        player.marker.addMarker(this.MATTER_EXCHANGE_MARKER, this);
        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this, sourceEffect: this.powers[0] });
        MOVE_CARDS(store, state, player.deck, player.hand, { count: 1, sourceCard: this, sourceEffect: this.powers[0] });
      });
      return state;
    }
    // Mind Shock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }

    return state;
  }
}
