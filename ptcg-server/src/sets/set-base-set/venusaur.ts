import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { Attack, Power, PowerType } from '../../game/store/card/pokemon-types';
import { MoveEnergyPrompt, CardTransfer } from '../../game/store/prompts/move-energy-prompt';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { EnergyCard, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../..';

function* moveEnergy(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  let hasBasicEnergy = false;
  let pokemonCount = 0;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
    pokemonCount += 1;
    const basicEnergyAttached = cardList.cards.some(c => {
      return c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
    });
    hasBasicEnergy = hasBasicEnergy || basicEnergyAttached;
  });

  if (!hasBasicEnergy || pokemonCount <= 1) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let transfers: CardTransfer[] = [];
  yield store.prompt(state, new MoveEnergyPrompt(
    player.id,
    GameMessage.MOVE_ENERGY_CARDS,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { cardType: CardType.GRASS },
    { min: 1, max: 1, allowCancel: false }
  ), result => {
    transfers = result || [];
    next();
  });

  // Cancelled by the user
  if (transfers.length === 0) {
    return state;
  }

  transfers.forEach(transfer => {
    const source = StateUtils.getTarget(state, player, transfer.from);
    const target = StateUtils.getTarget(state, player, transfer.to);
    source.moveCardTo(transfer.card, target);
  });
  
  return state;
}

export class Venusaur extends PokemonCard {

  public name = 'Venusaur';
  
  public set = 'BS';
  
  public fullName = 'Venusaur BS';
  
  public stage: Stage = Stage.STAGE_2;

  public cardType: CardType = CardType.GRASS;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public hp: number = 100;

  public weakness = [{ type: CardType.FIRE }];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];

  public powers: Power[] = [{
    name: 'Energy Trans',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'As often as you like during your turn (before your attack), you may take 1 {G} Energy card attached to 1 of your Pokémon and attach it to a different one. This power can’t be used if Venusaur is Asleep, Confused, or Paralyzed.'
  }];

  public attacks: Attack[] = [{
    name: 'Solarbeam',
    cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.GRASS],
    damage: 60,
    text: ''
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = moveEnergy(() => generator.next(), store, state, effect);
      return generator.next().value;    
    }

    return state;

  }

}