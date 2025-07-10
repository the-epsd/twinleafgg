import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, ChoosePokemonPrompt, GameMessage, SlotType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class AlolanPersianGX extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Alolan Meowth';
  public tags = [CardTag.POKEMON_GX];
  public cardType: CardType = D;
  public hp: number = 200;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Smug Face',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks, including damage, done to this Pokémon by your opponent\'s TAG TEAM Pokémon and Ultra Beasts, and by your opponent\'s Pokémon that have any Special Energy attached to them.'
  }];

  public attacks = [{
    name: 'Claw Slash',
    cost: [D, C, C],
    damage: 120,
    text: 'Prevent all effects of an attack, including damage, done to Latios ex by your opponent\'s Pokémon-ex during your opponent\'s next turn.'
  },
  {
    name: 'Stalking Claws GX',
    cost: [D, C, C],
    damage: 0,
    text: 'This attack does 120 damage to 1 of your opponent\'s Pokémon. This damage isn\'t affected by Weakness, Resistance, or any other effects on that Pokémon. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'CEC';
  public setNumber: string = '129';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Persian-GX';
  public fullName: string = 'Alolan Persian-GX CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AbstractAttackEffect && effect.target.getPokemonCard() === this) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      const isTagTeam = sourceCard?.tags.includes(CardTag.TAG_TEAM);
      const isUltraBeast = sourceCard?.tags.includes(CardTag.ULTRA_BEAST);
      const hasSpecialEnergy = effect.source.cards.some(energy => energy.energyType === EnergyType.SPECIAL);

      if (pokemonCard !== this) {
        return state;
      }

      if (isTagTeam || isUltraBeast || hasSpecialEnergy) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const player = StateUtils.findOwner(state, effect.target);
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0)
        return state;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const target = selected[0];
        target.damage += 120;
        const afterDamage = new AfterDamageEffect(effect, 120);
        state = store.reduceEffect(state, afterDamage);
      });
    }

    return state;
  }
}