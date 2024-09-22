import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, StateUtils, PowerType, Card, ChooseEnergyPrompt, GameMessage } from '../../game';
import { DealDamageEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Pikachuex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 200;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Tenacious Heart',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP and would be Knocked Out by an attack, it isn\'t Knocked Out and its remaining HP becomes 10 instead.'
  }];

  public attacks = [
    {
      name: 'Topaz Bolt',
      cost: [CardType.GRASS, CardType.LIGHTNING, CardType.METAL],
      damage: 300,
      text: 'Discard 3 Energy from this Pokémon.'
    },];

  public regulationMark = 'H';
  public set: string = 'SV8';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pikachu ex';
  public fullName: string = 'Pikachu ex SV8';

  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = StateUtils.findOwner(state, effect.target);
      const pokemonCard = effect.target.getPokemonCard();

      this.damageDealt = true;

      if (pokemonCard === this && this.damageDealt === true) {
        const checkHpEffect = new CheckHpEffect(player, effect.target);
        store.reduceEffect(state, checkHpEffect);

        // Try to reduce PowerEffect, to check if something is blocking our ability
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

        if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {
          effect.preventDefault = true;
          effect.target.damage = checkHpEffect.hp - 10;
        }
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }
    return state;
  }
}