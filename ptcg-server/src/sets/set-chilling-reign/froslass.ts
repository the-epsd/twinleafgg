import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType, StoreLike, State, AttachEnergyPrompt, PlayerType, SlotType, StateUtils, GameError } from '../../game';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

function* useLeParfum(next: Function, store: StoreLike, state: State,
  self: Froslass, effect: PlayPokemonEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  // Try to reduce PowerEffect, to check if something is blocking our ability
  try {
    const stub = new PowerEffect(player, {
      name: 'test',
      powerType: PowerType.ABILITY,
      text: ''
    }, self);
    store.reduceEffect(state, stub);
  } catch {
    return state;
  }

  yield state = store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.discard,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
    { allowCancel: true, min: 0, max: 1 }
  ), transfers => {
    transfers = transfers || [];
    // cancelled by user
    if (transfers.length === 0) {
      return;
    }
    for (const transfer of transfers) {
      const target = StateUtils.getTarget(state, player, transfer.to);
      player.discard.moveCardTo(transfer.card, target);
    }
  });
}


export class Froslass extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'E';

  public evolvesFrom = 'Snorunt';

  public cardType: CardType = CardType.WATER;

  public hp: number = 90;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Frost Over',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may attach a W Energy card from your discard pile to 1 of your Pokémon.'
  }];

  public attacks = [
    {
      name: 'Crystal Breath',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 90,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

  public name: string = 'Froslass';

  public fullName: string = 'Froslass CRE';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const generator = useLeParfum(() => generator.next(), store, state, this, effect);
      return generator.next().value;
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
