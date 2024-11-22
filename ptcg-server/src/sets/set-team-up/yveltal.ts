import { Card, ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PokemonCardList } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';


export class Yveltal extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [];

  public attacks = [
    {
      name: 'Derail',
      cost: [CardType.DARK],
      damage: 30,
      text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
    },
    {
      name: 'Clutch',
      cost: [CardType.DARK, CardType.DARK],
      damage: 60,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    }
  ];

  public set: string = 'TEU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Yveltal';

  public fullName: string = 'Yveltal TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof RetreatEffect && effect.player.active.attackMarker.hasMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect &&
      effect.player.active.attackMarker.hasMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {

      const player = effect.player;
      player.active.attackMarker.removeMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.attackMarker.addMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const specialEnergy = opponent.active.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL);

      if (specialEnergy.length === 0) {
        return state;
      }

      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];

        if (cards.length > 0) {
          opponent.active.moveCardsTo(cards, opponent.discard);
        }
      });
    }
    return state;
  }
}