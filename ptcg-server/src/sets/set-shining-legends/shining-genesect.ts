import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, SlotType,
  MoveEnergyPrompt, CardTarget, 
  PowerType,
  GameError} from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class ShiningGenesect extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Energy Reload',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may move a [G] Energy from 1 of your other Pokémon to this Pokémon.'
  }];

  public attacks = [
    {
      name: 'Gaia Blaster',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 50,
      text: 'This attack does 20 more damage times the amount of [G] Energy attached to this Pokémon.'
    },
  ];

  public set: string = 'SLG';

  public name: string = 'Shining Genesect';

  public fullName: string = 'Shining Genesect SLG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '9';

  public readonly ENERGY_RELOAD_MARKER = 'ENERGY_RELOAD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.ENERGY_RELOAD_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];

      if (player.marker.hasMarker(this.ENERGY_RELOAD_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList === player.active) {
          blockedFrom.push(target);
          return;
        }
        blockedTo.push(target);
      });

      return store.prompt(state, new MoveEnergyPrompt(
        effect.player.id,
        GameMessage.MOVE_ENERGY_TO_ACTIVE,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 1, max: 1, allowCancel: false, blockedFrom, blockedTo }
      ), result => {
        const transfers = result || [];

        player.marker.addMarker(this.ENERGY_RELOAD_MARKER, this);
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addSpecialCondition(SpecialCondition.ABILITY_USED);
          }
        });

        transfers.forEach(transfer => {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);
        });
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ENERGY_RELOAD_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
  
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
  
      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.GRASS;
        }).length;
      });
      effect.damage += energyCount * 20;
    }
    return state;
  }
}
  