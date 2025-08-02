import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { PowerType, MoveEnergyPrompt, CardTransfer, PlayerType, SlotType, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { EnergyCard, GameError, GameMessage, StateUtils } from '../../game';
import { HealEffect } from '../../game/store/effects/game-effects';


function* moveEnergy(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  let pokemonWithEnergy = 0;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
    if (cardList.cards.some(c => c instanceof EnergyCard)) {
      pokemonWithEnergy++;
    }
  });

  if (pokemonWithEnergy < 2) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  let transfers: CardTransfer[] = [];
  yield store.prompt(state, new MoveEnergyPrompt(
    player.id,
    GameMessage.MOVE_ENERGY_CARDS,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
    { allowCancel: true }
  ), result => {
    transfers = result || [];
    next();
  });

  if (transfers.length === 0) {
    return state;
  }

  for (const transfer of transfers) {
    const source = StateUtils.getTarget(state, player, transfer.from);
    const target = StateUtils.getTarget(state, player, transfer.to);
    source.moveCardTo(transfer.card, target);
  }

  return state;
}

export class MegaVenusaurEx extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Ivysaur';
  public tags = [CardTag.POKEMON_ex, CardTag.MEGA];
  public cardType: CardType = G;
  public hp: number = 380;
  public weakness = [{ type: R }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Solar Trans',
    powerType: PowerType.ABILITY,
    useWhileInPlay: true,
    text: 'As many times as you like during your turn, you may move a Basic Grass Energy from one of your Pokémon to another one of your Pokémon.'
  }];

  public attacks = [
    {
      name: 'Jungle Dump',
      cost: [G, G, G, G],
      damage: 240,
      text: 'Heal 30 damage from this Pokémon.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'M1L';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Venusaur ex';
  public fullName: string = 'Mega Venusaur ex M1L';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = moveEnergy(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const healEffect = new HealEffect(player, player.active, 30);
      state = store.reduceEffect(state, healEffect);
    }

    return state;
  }
} 