import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Rayquazaex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public hp: number = 110;
  public retreat = [C, C];

  public powers = [{
    name: 'Rage Aura',
    powerType: PowerType.POKEBODY,
    text: 'If you have more Prize cards left than your opponent, ignore all [C] Energy necessary to use Rayquaza ex\'s Special Circuit and Sky- high Claws attacks.'
  }];

  public attacks = [{
    name: 'Special Circuit',
    cost: [L, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon.This attack does 30 damage to the Pokémon. If you choose a Pokémon that has any Poké - Powers or Poké - Bodies, this attack does 50 damage instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Sky-High Claws',
    cost: [L, L, C, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Rayquaza ex';
  public fullName: string = 'Rayquaza ex DF';

  public getColorlessReduction(state: State): number {
    const player = StateUtils.findOwner(state, this.cards);
    const opponent = StateUtils.getOpponent(state, player);
    return player.getPrizeLeft() > opponent.getPrizeLeft() ? 2 : 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.POKEBODY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        console.log(effect.cost);
        return state;
      }

      const playerPrizes = player.getPrizeLeft();

      if (playerPrizes > opponent.getPrizeLeft()) {
        const costToRemove = 1;

        for (let i = 0; i < costToRemove; i++) {
          let index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }

      console.log(effect.cost);

      return state;
    }

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.POKEBODY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        console.log(effect.cost);
        return state;
      }

      const playerPrizes = player.getPrizeLeft();

      if (playerPrizes > opponent.getPrizeLeft()) {
        const costToRemove = 2;

        for (let i = 0; i < costToRemove; i++) {
          let index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }

      console.log(effect.cost);

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected;

        const pokemonWithAbilities: PokemonCard[] = [];

        // checking for poke-body
        const stubPowerEffectForActive = new PowerEffect(opponent, {
          name: 'test',
          powerType: PowerType.POKEBODY,
          text: ''
        }, targets[0].getPokemonCard()!);

        try {
          store.reduceEffect(state, stubPowerEffectForActive);

          if (targets[0].getPokemonCard() && targets[0].getPokemonCard()?.powers.length) {
            pokemonWithAbilities.push(targets[0].getPokemonCard() as PokemonCard);
          }
        } catch {
          // no abilities in active
        }


        // checking for poke-power
        const stubPowerEffectForActive2 = new PowerEffect(opponent, {
          name: 'test',
          powerType: PowerType.POKEPOWER,
          text: ''
        }, targets[0].getPokemonCard()!);

        try {
          store.reduceEffect(state, stubPowerEffectForActive2);

          if (targets[0].getPokemonCard() && targets[0].getPokemonCard()?.powers.length) {
            pokemonWithAbilities.push(targets[0].getPokemonCard() as PokemonCard);
          }
        } catch {
          // no abilities in active
        }


        targets.forEach(target => {
          //base damage
          let damageEffect = new DealDamageEffect(effect, 30);

          // if target has poke body or poke power, damage = 50 
          if (pokemonWithAbilities.length > 0) {
            damageEffect = new DealDamageEffect(effect, 50);
          }
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }

    return state;
  }
}