import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, StateUtils, PlayerType, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class DarkAmpharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = L;
  public additionalCardTypes = [D];
  public tags = [CardTag.DARK];
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Darkest Impulse',
    powerType: PowerType.ABILITY,
    text: 'As long as Dark Ampharos is in play, whenever your opponent plays an Evolution card from his or her hand to evolve 1 of his or her Pokémon, put 2 damage counters on that Pokémon. You can\'t use more than 1 Darkest Impulse Poké-Body each turn.'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Shock Bolt',
    cost: [L, C, C],
    damage: 70,
    text: 'Discard all [L] Energy attached to Dark Ampharos.'
  }];

  public set: string = 'TRR';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dark Ampharos';
  public fullName: string = 'Dark Ampharos TRR';
  public evolvesFrom: string = 'Dark Flaaffy';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Darkest Impulse Poké-Body
    if (effect instanceof EvolveEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, opponent, this)) { return state; }
      if (effect.darkestImpulseSV) { return state; }

      // Check if Dark Ampharos is in play
      let isAmpharosInPlay = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          isAmpharosInPlay = true;
        }
      });
      if (!isAmpharosInPlay) { return state; }

      store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: this.powers[0].name });

      effect.target.damage += 20; // 2 damage counters = 20 damage
      effect.darkestImpulseSV = true;
    }

    // Handle Shock Bolt attack
    // if (WAS_ATTACK_USED(effect, 1, this)) {
    //   const player = effect.player;
    //   const cardList = player.active;

    //   // Discard all Lightning Energy
    //   const discardEnergyEffect = new DiscardCardsEffect(effect, );
    //   discardEnergyEffect.target = cardList;
    //   store.reduceEffect(state, discardEnergyEffect);
    // }

    return state;
  }
} 