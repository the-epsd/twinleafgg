import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType, StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { GameMessage } from '../../game/game-message';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Golbat extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Zubat';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [];

  public powers = [{
    name: 'Sneaky Bite',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your ' +
      'Pokemon, you may put 2 damage counters on 1 of your opponent\'s Pokemon.'
  }];

  public attacks = [
    {
      name: 'Swoop Across',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 10 damage to each of your opponent\'s Pokemon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'PHF';

  public name: string = 'Golbat';

  public fullName: string = 'Golbat PHF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) return state;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: true },
      ), selected => {
        const targets = selected || [];

        if (targets.length > 0) {
          // Check if ability can target selected Pokemon
          const canApplyAbility = new EffectOfAbilityEffect(player, this.powers[0], this, targets[0]);
          store.reduceEffect(state, canApplyAbility);
          if (canApplyAbility.target) {
            canApplyAbility.target.damage += 20;
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage = 10;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList === opponent.active) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }

}
