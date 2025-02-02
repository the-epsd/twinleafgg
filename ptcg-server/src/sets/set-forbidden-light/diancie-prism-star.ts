import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';

export class DianciePS extends PokemonCard {

  public tags = [CardTag.PRISM_STAR];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 120;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Princess\'s Cheers',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, your [F] Pokémon\'s attacks do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Diamond Rain',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: 90,
      text: 'Heal 30 damage from each of your Benched Pokémon.'
    }
  ];

  public set: string = 'FLI';

  public setNumber = '74';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Diancie Prism Star';

  public fullName: string = 'Diancie Prism Star FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // we love ability lock so much
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // checking if this pokemon is in the active
      if (player.active.getPokemonCard() === this) {
        return state;
      }
      // checking if this pokemon is in play
      let isThisInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }

      const oppActive = opponent.active.getPokemonCard();
      const damageSource = effect.source.getPokemonCard();

      if (damageSource && damageSource.cardType === CardType.FIGHTING && damageSource !== oppActive) {
        effect.damage += 20;
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList !== player.active) {
          const healTargetEffect = new HealTargetEffect(effect, 30);
          healTargetEffect.target = cardList;
          state = store.reduceEffect(state, healTargetEffect);
        }
      });
    }

    return state;
  }

}