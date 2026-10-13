import {
  ChooseCardsPrompt,
  EnergyCard,
  GameError,
  GameMessage,
  PowerType,
  Stage,
  StateUtils,
  StoreLike,
  State,
  SuperType,
} from '../../../game';
import { CardType, EnergyType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { MOVE_CARDS, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Pyroar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Litleo';
  public hp: number = 110;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Flare Command',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may discard a [R] Energy attached to this Pokémon. If you do, switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.'
  }];

  public attacks = [{
    name: 'Inferno Onrush',
    cost: [R, R, R, C],
    damage: 110,
    text: 'This Pokémon does 30 damage to itself.'
  }];

  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Pyroar';
  public fullName: string = 'Pyroar PHF';

  public readonly FLARE_COMMAND_MARKER = 'FLARE_COMMAND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Inferno Onrush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.FLARE_COMMAND_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.FLARE_COMMAND_MARKER, this);
    }

    // Flare Command
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      if (player.marker.hasMarker(this.FLARE_COMMAND_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const hasEnergyAttached = cardList.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Fire Energy';
      });

      if (!hasEnergyAttached) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        selected = selected || [];
        if (selected.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, player.active, player.discard, { cards: selected, sourceCard: this });
        player.marker.addMarker(this.FLARE_COMMAND_MARKER, this);

        return GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
          store,
          state,
          player,
          this.powers[0],
          this,
          { allowCancel: false },
        );
      });
    }

    return state;
  }
}
