import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, StateUtils,
  PokemonCardList, CardTarget, PlayerType, ChoosePokemonPrompt, SlotType } from '../../game';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

function* usePower(next: Function, store: StoreLike, state: State, self: Shedinja, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const cardList = StateUtils.findCardList(state, self);

  // check if Shedinja is on player's Bench
  const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
  if (benchIndex === -1) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
  const pokemonCard = player.bench[benchIndex].getPokemonCard();
  if (pokemonCard !== self) {
    throw new GameError(GameMessage.ILLEGAL_ACTION);
  }

  // Check if player has a Pokemon without tool, other than Shedinja
  let hasPokemonWithoutTool = false;
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.tool === undefined && card !== self) {
      hasPokemonWithoutTool = true;
    } else {
      blocked.push(target);
    }
  });

  if (!hasPokemonWithoutTool) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  // everything checked, we are ready to attach Shedinja as a tool.
  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { allowCancel: true, blocked }
  ), targets => {
    if (targets && targets.length > 0) {
      // Attach Shedinja as a Pokemon Tool
      player.bench[benchIndex].moveCardTo(pokemonCard, targets[0]);
      targets[0].tool = pokemonCard;

      // Discard other cards
      player.bench[benchIndex].moveTo(player.discard);
      player.bench[benchIndex].clearEffects();
    }
  });
}

export class Shedinja extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Nincada';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 40;

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Vessel of Life',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard all cards attached to this Pokémon and attach it to 1 of your Pokémon as a Pokémon Tool card. When the Pokémon this card is attached to is Knocked Out, your opponent takes 1 fewer Prize card.'
  }];

  public attacks = [
    {
      name: 'Haunt',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Put 3 damage counters on your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'LOT';

  public setNumber = '95';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Shedinja';

  public fullName: string = 'Shedinja LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = usePower(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.active.tool === this) {
      effect.prizeCount -= 1;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.damage += 30;
    }

    return state;
  }

}
