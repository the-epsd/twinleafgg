import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage } from '../../game';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { WAS_POWER_USED, WAS_ATTACK_USED, ABILITY_USED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { GameError } from '../../game/game-error';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class MegaGreninjaex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Frogadier';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public hp: number = 350;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Mortal Shuriken',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokemon is in the Active Spot, you may discard a Basic [W] Energy card from your hand in order to use this Ability. Place 6 damage counters on 1 of your opponent\'s Pokemon.'
  }];

  public attacks = [{
    name: 'Ninja Spinner',
    cost: [W, W],
    damage: 120,
    text: 'You may put a [W] Energy attached to this Pokemon into your hand and have this attack do 80 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Mega Greninja ex';
  public fullName: string = 'Mega Greninja ex M4';

  public readonly MORTAL_SHURIKEN_MARKER = 'MORTAL_SHURIKEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const basicWInHand = player.hand.cards.find(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(W)
      );
      if (!basicWInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasOpponentPokemon = opponent.active.cards.length > 0 || opponent.bench.some(b => b.cards.length > 0);
      if (!hasOpponentPokemon) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.MORTAL_SHURIKEN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          player.marker.addMarker(this.MORTAL_SHURIKEN_MARKER, this);
          return state;
        }
        player.marker.addMarker(this.MORTAL_SHURIKEN_MARKER, this);
        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this, sourceEffect: this.powers[0] });
      });

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        if (targets.length > 0) {
          const placeCounters = new PlaceDamageCountersEffect(player, targets[0], 60, this);
          store.reduceEffect(state, placeCounters);
        }
        ABILITY_USED(player, this);
      });
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.MORTAL_SHURIKEN_MARKER, this);
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.MORTAL_SHURIKEN_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const wEnergies = player.active.cards.filter(c =>
        c instanceof EnergyCard && c.provides.includes(W)
      );
      if (wEnergies.length === 0) {
        return state;
      }
      const blocked: number[] = [];
      player.active.cards.forEach((c, i) => {
        if (!(c instanceof EnergyCard) || !c.provides.includes(W)) {
          blocked.push(i);
        }
      });
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.active,
        {},
        { min: 0, max: 1, allowCancel: true, blocked }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          player.active.moveCardTo(cards[0], player.hand);
          effect.damage += 80;
        }
      });
    }
    return state;
  }
}
