import { GameError, GameMessage, PlayerType, StoreLike, State, StateUtils } from '../../game';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';


export class ScrambleEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name = 'Scramble Energy';
  public fullName = 'Scramble Energy DX';

  public text: string = 'Scramble Energy can be attached only to an Evolved Pokémon (excluding Pokémon-ex). Scramble Energy provides [C] Energy. While in play, if you have more Prize cards left than your opponent, Scramble Energy provides every type of Energy but provides only 3 in any combination at a time. If the Pokémon Scramble Energy is attached to isn\'t an Evolved Pokémon (or evolves into Pokémon-ex), discard Scramble Energy.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Cannot attach to basic or ex
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const attachedTo = effect.target.getPokemonCard();

      if (!!attachedTo && (attachedTo.tags.includes(CardTag.POKEMON_ex) || effect.target.getPokemons().length < 2)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Provide energy 
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() > opponent.getPrizeLeft()) {
        effect.energyMap.push({ card: this, provides: [CardType.ANY, CardType.ANY, CardType.ANY] });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      }
    }

    // Discard card when not attached to Evolved Pokemon or pokemon-ex
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this)) {
            return;
          }

          const attachedTo = cardList.getPokemonCard();

          if (!!attachedTo && (attachedTo.tags.includes(CardTag.POKEMON_ex) || cardList.getPokemons().length < 2)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });

      return state;
    }
    return state;
  }
}