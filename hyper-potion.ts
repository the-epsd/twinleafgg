import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType, } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType, CardTarget, GameError, GameMessage,PokemonCardList, Card, ChooseEnergyPrompt, EnergyCard} from '../../game';
import { HealEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  

  const blocked: CardTarget[] = [];
  let hasPokemonWithDamage: boolean = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target,) => {
    if (cardList.damage === 0 || !cardList.cards.some(c => c instanceof EnergyCard)) {
      blocked.push(target);
    } else {
      hasPokemonWithDamage = true;
    }
    
      

  });

  if (hasPokemonWithDamage === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    

  }
       
  // Do not discard the card yet
  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_HEAL,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { allowCancel: false, blocked }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }
  
  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      

  const target = targets[0];
  let cards: Card[] = [];
  state = store.prompt(state, new ChooseEnergyPrompt(
    player.id,
    GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
    checkProvidedEnergy.energyMap,
    [CardType.COLORLESS, CardType.COLORLESS],
    { allowCancel: false }
  ), _cards => {
    
    
    
  
  });

  if (targets.length === 0) {
    return state;
  }
  
  // Heal Pokemon
  const healEffect = new HealEffect(player, target, 120);
  store.reduceEffect(state, healEffect);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  target.moveCardsTo(cards, player.discard);

  

   
}

export class HyperPotion extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '166';

  public regulationMark = 'D';

  public name: string = 'Hyper Potion';

  public fullName: string = 'Hyper Potion SSH';

  public text: string =
    'Heal 120 damage from 1 of your Pokémon that has at least 2 Energy attached ' +
    'if you healed any damage in this way, discard 2 Energy from it. ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
      
    }
    return state;
  }
  

}
