import { CardType, Player, PlayerType, PokemonCard, State, StateUtils, StoreLike } from '../../../game';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

const INCARNATE_UNION_NAMES = ['Tornadus', 'Thundurus', 'Landorus', 'Enamorus'];

export function hasIncarnateUnionInPlay(player: Player): boolean {
  const found = new Set<string>();
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, pokemonCard) => {
    if (INCARNATE_UNION_NAMES.includes(pokemonCard.name)) {
      found.add(pokemonCard.name);
    }
  });
  return found.size === INCARNATE_UNION_NAMES.length;
}

export function reduceIncarnateUnionEffect(
  store: StoreLike,
  state: State,
  effect: CheckAttackCostEffect,
  card: PokemonCard,
): State {
  if (effect.player.active.getPokemonCard() !== card) {
    return state;
  }

  const player = effect.player;

  if (!StateUtils.isPokemonInPlay(player, card)) {
    return state;
  }

  if (IS_ABILITY_BLOCKED(store, state, player, card)) {
    return state;
  }

  if (!hasIncarnateUnionInPlay(player)) {
    return state;
  }

  effect.cost = effect.cost.filter(c => c !== CardType.COLORLESS);
  return state;
}
