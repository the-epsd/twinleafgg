import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, GameError, GameMessage, StateUtils,
  PokemonCardList, CardTarget, PlayerType, ChoosePokemonPrompt, SlotType
} from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

function* usePower(next: Function, store: StoreLike, state: State, self: UnownE, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const cardList = StateUtils.findCardList(state, self);

  // check if UnownQ is on player's Bench
  const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
  if (benchIndex === -1) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
  const pokemonCard = player.bench[benchIndex].getPokemonCard();
  if (pokemonCard !== self) {
    throw new GameError(GameMessage.ILLEGAL_ACTION);
  }

  // Check if player has a Pokemon without tool, other than UnownQ
  let hasPokemonWithoutTool = false;
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.tools.length === 0 && card !== self) {
      hasPokemonWithoutTool = true;
    } else {
      blocked.push(target);
    }
  });

  if (!hasPokemonWithoutTool) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  // everything checked, we are ready to attach UnownQ as a tool.
  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { allowCancel: true, blocked }
  ), targets => {
    if (targets && targets.length > 0) {
      // Attach Unown Q as a Pokemon Tool
      player.bench[benchIndex].moveCardTo(pokemonCard, targets[0]);
      targets[0].tools.push(pokemonCard);

      // Discard other cards
      player.bench[benchIndex].moveTo(player.discard);
      player.bench[benchIndex].clearEffects();
    }
  });
}

export class UnownE extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'EQUIP',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Unown E is on your Bench, you may discard all cards attached to Unown E and attach Unown E to 1 of your Pokémon as a Pokémon Tool card. As long as Unown E is attached to a Pokémon, that Pokémon gets +10 HP.'
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [C, C],
    damage: 0,
    text: '**THIS ATTACK DOES NOT WORK LIL BRO**\n\nDuring your opponent\'s next turn, whenever your opponent flips a coin, treat it as tails.'
  }];

  public set: string = 'MT';
  public name: string = 'Unown [E]';
  public fullName: string = 'Unown [E] MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = usePower(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() !== this) {
      const card = effect.target.getPokemonCard();

      if (card === undefined) {
        return state;
      }

      if (card.stage === Stage.BASIC) {
        effect.hp += 10;
        effect.target.hpBonus = (effect.target.hpBonus || 0) + 10;
      }
      return state;
    }

    return state;
  }

}
