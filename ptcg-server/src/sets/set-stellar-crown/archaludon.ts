import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Archaludon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Duraludon';

  public cardType: CardType = CardType.METAL;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Metal Bridge',
    powerType: PowerType.ABILITY,
    text: 'All of your Pokémon that have [M] Energy attached have no Retreat Cost.'
  }];

  public attacks = [
    {
      name: 'Iron Blaster',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 160,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public regulationMark: string = 'H';

  public set: string = 'SCR';

  public name: string = 'Archaludon';

  public fullName: string = 'Archaludon SV6a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '107';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public readonly OPPONENT_CANNOT_PLAY_STADIUMS_MARKER = 'OPPONENT_CANNOT_PLAY_STADIUMS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      const checkPokemonType = new CheckPokemonTypeEffect(effect.player.active);
      store.reduceEffect(state, checkPokemonType);

      if (!checkPokemonType.cardTypes.includes(CardType.METAL)) {
        return state;
      }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      let inPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          inPlay = true;
        }
      });

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const activeHasMetalEnergy = checkProvidedEnergyEffect.energyMap.some(p => p.provides.includes(CardType.METAL));

      if (inPlay && activeHasMetalEnergy) {
        effect.cost = [];
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    return state;
  }
}
