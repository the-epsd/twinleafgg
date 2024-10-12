import { ChoosePokemonPrompt, GamePhase, Player, PlayerType, Power, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';

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
    function simulateCoinFlip(store: StoreLike, state: State, player: Player): boolean {
      const result = Math.random() < 0.5;
      const gameMessage = result ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS;
      store.log(state, gameMessage, { name: player.name });
      return result;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this || sourceCard === undefined || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      try {
        const coinFlip = new CoinFlipEffect(player);
        store.reduceEffect(state, coinFlip);
      } catch {
        return state;
      }

      const coinFlipResult = simulateCoinFlip(store, state, player);

      if (coinFlipResult) {
        effect.damage = 0;
        store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMGE, { name: opponent.name, pokemon: this.name });
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

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
      ), target => {
        if (!target || target.length === 0) {
          return;
        }

        const targets = target || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });

      return state;
    }

    return state;
  }
}