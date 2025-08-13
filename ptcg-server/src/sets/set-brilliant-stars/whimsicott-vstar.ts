import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, GameError, PlayerType, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect, AttachPokemonToolEffect } from '../../game/store/effects/play-card-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class WhimsicottVSTAR extends PokemonCard {
  public stage: Stage = Stage.VSTAR;
  public tags = [CardTag.POKEMON_VSTAR];
  public evolvesFrom = 'Whimsicott V';
  public cardType: CardType = P;
  public hp: number = 250;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Trick Wind',
    cost: [P, C, C],
    damage: 160,
    text: 'During your opponent\'s next turn, they can\'t play any Pokémon Tool or Special Energy cards from their hand.',
  },
  {
    name: 'Fluffball Star',
    cost: [P],
    damage: 0,
    text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon for each Energy attached to this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 VSTAR Power in a game.)',
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Whimsicott VSTAR';
  public fullName: string = 'Whimsicott VSTAR BRS';

  public readonly DOMINATING_ECHO_MARKER = 'DOMINATING_ECHO_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Trick Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.marker.addMarker(this.DOMINATING_ECHO_MARKER, this);
    }

    if (effect instanceof AttachPokemonToolEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof AttachEnergyEffect && effect.energyCard.energyType === EnergyType.SPECIAL) {
      const player = effect.player;
      if (player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      if (effect.player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
        effect.player.marker.removeMarker(this.DOMINATING_ECHO_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.DOMINATING_ECHO_MARKER, this);
        });
      }
    }

    // Fluffball Star
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (player.usedVSTAR) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      player.usedVSTAR = true;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energies: number = 0;
      checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(60 * energies, effect, store, state);
    }

    return state;
  }
}