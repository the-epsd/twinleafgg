import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Leavanny extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Swadloon';
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers: Power[] = [{
    name: 'Blanket Weaver',
    powerType: PowerType.ABILITY,
    text: 'Your [G] Pokémon take 40 less damage from your opponent\'s attacks (after applying Weakness and Resistance). You can\'t apply more than 1 Blanket Weaver Ability at a time.'
  }];

  public attacks: Attack[] = [{
    name: 'Razor Leaf',
    cost: [G, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Leavanny';
  public fullName: string = 'Leavanny UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const player = StateUtils.findOwner(state, cardList);

      // Check if Leavanny is actually in play for "player"
      const isInPlay = player.active.cards.includes(this) || player.bench.some(b => b.cards.includes(this));

      if (!isInPlay) {
        return state;
      }

      // Check if the CheckHpEffect belongs to the same player who owns Kricketune
      // If effect.player is different, skip boosting.
      if (effect.player.id !== player.id) {
        return state;
      }

      // Instead of enumerating all Pokémon in the board
      // (which is not needed since it's already happening in findKoPokemons),
      // we identify which Pokemon is being checked right now
      const targetPokemonCard = effect.target.getPokemonCard();
      if (!targetPokemonCard) {
        return state;
      }

      // If that Pokemon is not Grass, skip
      // (we use checkPokemonTypeEffect instead of targetPokemonCard.cardType
      // to address additional types)
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonTypeEffect);
      if (!checkPokemonTypeEffect.cardTypes.includes(CardType.GRASS)) {
        return state;
      }

      // Check if the ability is disabled by calling PowerEffect stub
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.damage -= 40;
    }

    return state;
  }
}