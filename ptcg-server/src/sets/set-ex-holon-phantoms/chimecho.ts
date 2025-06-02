import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameError, GameMessage, EnergyCard, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect, PlaySupporterEffect } from '../../game/store/effects/play-card-effects';

export class Chimecho extends PokemonCard {
  public tags = [CardTag.DELTA_SPECIES];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Delta Support',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if you have a Supporter card with Holon in its name in play, you may search your discard pile for a basic Energy card or a Delta Rainbow Energy card, show it to your opponent, and put it into your hand. This power can\'t be used if Chimecho is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Hook',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Chimecho';
  public fullName: string = 'Chimecho HP';

  public readonly HOLON_SUPPORTER_MARKER = 'HOLON_SUPPORTER_MARKER';
  public readonly DELTA_SUPPORT_USED_MARKER = 'DELTA_SUPPORT_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Track supporters played
    if (effect instanceof PlaySupporterEffect) {
      if (effect.trainerCard.tags.includes(CardTag.DELTA_SPECIES)) {
        effect.player.marker.addMarker(this.HOLON_SUPPORTER_MARKER, this);
      }
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.DELTA_SUPPORT_USED_MARKER, effect.player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DELTA_SUPPORT_USED_MARKER, this);
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HOLON_SUPPORTER_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.DELTA_SUPPORT_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (!HAS_MARKER(this.HOLON_SUPPORTER_MARKER, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard && (c.energyType === EnergyType.BASIC || c.name === 'Delta Rainbow Energy');
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (card instanceof EnergyCard && (card.energyType === EnergyType.BASIC || card.name === 'Delta Rainbow Energy')) {
        } else {
          blocked.push(index);
        }
      });

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false, blocked }
      ), cards => {
        cards = cards || [];
        player.discard.moveCardsTo(cards, player.hand);
      });

      ADD_MARKER(this.DELTA_SUPPORT_USED_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    return state;
  }
}