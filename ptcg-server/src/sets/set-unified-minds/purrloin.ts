import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, CardTarget, PlayerType, GameMessage, PokemonCardList, ChoosePokemonPrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useCleaningUp(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let pokemonsWithTool = 0;
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.tool !== undefined) {
      pokemonsWithTool += 1;
    } else {
      blocked.push(target);
    }
  });
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.tool !== undefined) {
      pokemonsWithTool += 1;
    } else {
      blocked.push(target);
    }
  });
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const max = Math.min(1, pokemonsWithTool);
  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
    PlayerType.ANY,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { min: 1, max: max, allowCancel: true, blocked }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }

  targets.forEach(target => {
    const owner = StateUtils.findOwner(state, target);
    if (target.tool !== undefined) {
      target.moveCardTo(target.tool, owner.discard);
      target.tool = undefined;
    }
  });

  return state;
}

export class Purrloin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Cleaning Up',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Discard a Pokémon Tool from 1 of your opponent\'s Pokémon.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '135';
  public name: string = 'Purrloin';
  public fullName: string = 'Purrloin UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if(effect instanceof AttackEffect && effect.attack === this.attacks[0]) { 
      const generator = useCleaningUp(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}