import { AttachEnergyPrompt, GameError, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Gardevoir extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kirlia';
  public hp: number = 100;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Psy Shadow',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your deck for a [P] Energy card and attach it to 1 of your Pokémon. Put 2 damage counters on that Pokémon. Shuffle your deck afterward. This power can\'t be used if Gardevoir is affected by a Special Condition.',
  }];

  public attacks = [{
    name: 'Energy Burst',
    cost: [P],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the total amount of Energy attached to Gardevoir and the Defending Pokémon.',
  }];

  public set: string = 'RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Gardevoir';
  public fullName: string = 'Gardevoir RS';

  public readonly PSY_SHADOW_MARKER = 'PSY_SHADOW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.PSY_SHADOW_MARKER, this);

    // Psy Shadow
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      USE_ABILITY_ONCE_PER_TURN(player, this.PSY_SHADOW_MARKER, this);
      ABILITY_USED(player, this);

      store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, name: 'Psychic Energy' },
        { allowCancel: false, min: 0, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this });
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(player, target, 20, this, this.powers[0]),
          );
        }
      });
    }

    // Energy Burst
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const player = effect.player;

      const checkProvidedEnergyOpponent = new CheckProvidedEnergyEffect(opponent, opponent.active);
      const checkProvidedEnergyPlayer = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyOpponent);
      store.reduceEffect(state, checkProvidedEnergyPlayer);

      const totalEnergy = checkProvidedEnergyOpponent.energyMap.reduce((sum, em) => sum + em.provides.length, 0)
        + checkProvidedEnergyPlayer.energyMap.reduce((sum, em) => sum + em.provides.length, 0);

      effect.damage = totalEnergy * 10;
    }

    return state;
  }
}
