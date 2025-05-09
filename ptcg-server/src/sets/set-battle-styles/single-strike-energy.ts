import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { GameError, GameMessage, PlayerType } from '../../game';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class SingleStrikeEnergy extends EnergyCard {
  public tags: CardTag[] = [CardTag.SINGLE_STRIKE];
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '141';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Single Strike Energy';
  public fullName = 'Single Strike Energy BST';

  public text = `This card can only be attached to a Single Strike Pokémon. If this card is attached to anything other than a Single Strike Pokémon, discard this card.

As long as this card is attached to a Pokémon, it provides [F] and [D] Energy but provides only 1 Energy at a time, and the attacks of the Pokémon this card is attached to do 20 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Provide energy when attached to Single Strike Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const pokemon = effect.source;

      if (pokemon.getPokemonCard()?.tags.includes(CardTag.SINGLE_STRIKE)) {
        effect.energyMap.push({ card: this, provides: [CardType.FIGHTING || CardType.DARK] });
      }
    }

    // Prevent attaching to non Single Strike Pokemon
    if (effect instanceof AttachEnergyEffect) {
      if (effect.energyCard === this && !effect.target.getPokemonCard()?.tags.includes(CardTag.SINGLE_STRIKE)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Discard card when not attached to Single Strike Pokemon
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this) || IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
            return;
          }

          if (!cardList.getPokemonCard()?.tags.includes(CardTag.SINGLE_STRIKE)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
    }

    // Deal +20 damage
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target !== opponent.active || IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, effect.source)) {
        return state;
      }

      effect.damage += 20;
    }

    return state;
  }
}