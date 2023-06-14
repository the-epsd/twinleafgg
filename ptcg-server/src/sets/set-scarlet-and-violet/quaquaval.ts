import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils,
  GameError, GameMessage, EnergyCard, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import {AttachEnergyPrompt} from '../../game/store/prompts/attach-energy-prompt';

export class Quaquaval extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Quaxwell';

  public cardType: CardType = CardType.WATER;

  public hp: number = 170;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Energy Carnival',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may attach a Basic Energy card ' +
      'from your hand to 1 of your Pokémon.'
  }];

  public attacks = [
    {
      name: 'Hydro Kick',
      cost: [ CardType.WATER, CardType.WATER, CardType.COLORLESS ],
      damage: 140,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public name: string = 'Quaquaval';

  public fullName: string = 'Quaquaval SVI 54';

  public readonly ENERGY_CARNIVAL_MAREKER = 'ENERGY_CARNIVAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.ENERGY_CARNIVAL_MAREKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
        });
        if (!hasEnergyInHand) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }
      if (player.marker.hasMarker(this.ENERGY_CARNIVAL_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        player.marker.addMarker(this.ENERGY_CARNIVAL_MAREKER, this);
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ENERGY_CARNIVAL_MAREKER, this);
    }

    return state;
  }


}
