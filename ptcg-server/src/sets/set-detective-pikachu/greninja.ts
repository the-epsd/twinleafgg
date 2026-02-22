import { ChoosePokemonPrompt, GamePhase, PlayerType, Power, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { DAMAGE_OPPONENT_POKEMON, IS_ABILITY_BLOCKED, SIMULATE_COIN_FLIP, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Greninja extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Frogadier';

  public cardType: CardType = CardType.WATER;

  public hp: number = 140;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers: Power[] = [{
    name: 'Evasion Jutsu',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.'
  }];

  public attacks = [
    {
      name: 'Furious Shurikens',
      cost: [CardType.WATER, CardType.WATER],
      damage: 0,
      text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'DET';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '9';

  public name: string = 'Greninja';

  public fullName: string = 'Greninja DET';

  public usedMirageBarrage: boolean = false;
  public blockDamage: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this || sourceCard === undefined || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      try {
        const coinFlip = new CoinFlipEffect(player);
        store.reduceEffect(state, coinFlip);
      } catch {
        return state;
      }

      const coinFlipResult = SIMULATE_COIN_FLIP(store, state, player);

      if (coinFlipResult) {
        effect.damage = 0;
        store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
      }

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let attackTargets = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, _ => attackTargets += 1);
      const min = Math.min(attackTargets, 2);
      const max = Math.min(attackTargets, 2);

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min, max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 50, targets);
      });

      return state;
    }

    return state;
  }
}