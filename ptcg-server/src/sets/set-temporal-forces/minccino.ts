import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, GameMessage, CardTarget, ChoosePokemonPrompt, GameError, PlayerType, SlotType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

function* useCleaningUp(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  let pokemonsWithTool = 0;
  const blocked: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.tool !== undefined) {
      pokemonsWithTool += 1;
    } else {
      blocked.push(target);
    }
  });
  
  if (pokemonsWithTool === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  
  const max = Math.min(2, pokemonsWithTool);
  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
    PlayerType.TOP_PLAYER,
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

export class Minccino extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Beat',
      cost: [CardType.COLORLESS ],
      damage: 10,
      text: ''
    },
    {
      name: 'Cleaning Up',
      cost: [CardType.COLORLESS, CardType.COLORLESS ],
      damage: 0,
      text: 'Discard up to 2 Pokémon Tools from your opponent\'s Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '136';

  public name: string = 'Minccino';

  public fullName: string = 'Minccino TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useCleaningUp(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
