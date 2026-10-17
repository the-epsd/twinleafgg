import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, IS_POKEPOWER_BLOCKED, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownI extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'ITEM',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if you have Unown I, Unown T, Unown E, and Unown M on your Bench, you may search your deck for a Trainer card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. You can\'t use more than 1 ITEM Poké-Power each turn.',
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [C],
    damage: 0,
    text: 'Choose an Energy card attached to the Defending Pokémon and put it face down. Treat that card as a Special Energy card that provides Colorless Energy and doesn\'t have any effect other than providing Energy. Put that card face up at the end of your opponent\'s next turn.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Unown [I]';
  public fullName: string = 'Unown [I] MT';

  public readonly ABILITY_USED_MARKER = 'ITEM_POKEPOWER_USED_MARKER';
  public readonly FACE_DOWN_ENERGY_MARKER = 'UNOWN_I_FACE_DOWN_ENERGY_MARKER';
  private faceDownEnergy: EnergyCard | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // All four letters must be on the Bench (ITEM Unown itself must be Benched)
      const isOnBench = player.bench.some(slot => slot.getPokemonCard() === this);
      if (!isOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const benchNames = new Set<string>();
      player.bench.forEach(slot => {
        const card = slot.getPokemonCard();
        if (card) {
          benchNames.add(card.name);
        }
      });

      const required = ['Unown [I]', 'Unown [T]', 'Unown [E]', 'Unown [M]'];
      if (!required.every(name => benchNames.has(name))) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false }
      );
      return state;
    }

    // Hidden Power: blank chosen energy to Colorless until end of opponent's next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasEnergy = opponent.active.cards.some(c => c instanceof EnergyCard);
      if (!hasEnergy) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0 || !(cards[0] instanceof EnergyCard)) {
          return;
        }
        this.faceDownEnergy = cards[0];
        ADD_MARKER(this.FACE_DOWN_ENERGY_MARKER, opponent, this);
      });
    }

    if (
      effect instanceof CheckProvidedEnergyEffect
      && HAS_MARKER(this.FACE_DOWN_ENERGY_MARKER, effect.player, this)
      && this.faceDownEnergy
    ) {
      effect.energyMap.forEach(em => {
        if (em.card === this.faceDownEnergy) {
          em.provides = [CardType.COLORLESS];
        }
      });
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.FACE_DOWN_ENERGY_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.FACE_DOWN_ENERGY_MARKER, effect.player, this);
      this.faceDownEnergy = undefined;
    }

    return state;
  }
}
