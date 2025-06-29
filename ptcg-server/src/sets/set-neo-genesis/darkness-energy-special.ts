import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayerType, StateUtils } from '../../game';

export class DarknessEnergySpecial extends EnergyCard {
  public provides: CardType[] = [CardType.DARK];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'N1';
  public name = 'Darkness Energy';
  public fullName = 'Darkness Energy N1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public text = 'If the Pokémon Darkness Energy is attached to damages the Defending Pokémon (after applying Weakness and Resistance), the attack does 10 more damage to the Defending Pokémon. At the end of every turn, put 1 damage counter on the Pokémon Darkness Energy is attached to, unless it\'s [D] or has Dark in its name.\n\nDarkness Energy provides [D] Energy. (Doesn\'t count as a basic Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Increase damage output
    if (effect instanceof PutDamageEffect) {
      if (effect.source.cards.includes(this)) {
        effect.damage += 10;
      }
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.forEachPokemon(PlayerType.ANY, (pokemon) => {
        if (pokemon.cards.includes(this)) {
          const checkPokemonType = new CheckPokemonTypeEffect(pokemon);
          store.reduceEffect(state, checkPokemonType);
          if (!checkPokemonType.cardTypes.includes(CardType.DARK) && !pokemon.getPokemonCard()?.tags.includes(CardTag.DARK)) {
            pokemon.damage += 10;
          }
        }
      });
      opponent.forEachPokemon(PlayerType.ANY, (pokemon) => {
        if (pokemon.cards.includes(this)) {
          const checkPokemonType = new CheckPokemonTypeEffect(pokemon);
          store.reduceEffect(state, checkPokemonType);
          if (!checkPokemonType.cardTypes.includes(CardType.DARK) && !pokemon.getPokemonCard()?.tags.includes(CardTag.DARK)) {
            pokemon.damage += 10;
          }
        }
      });
    }

    return state;
  }

}
