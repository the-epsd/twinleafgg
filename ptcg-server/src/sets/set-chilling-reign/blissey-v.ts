import { PokemonCard, Stage, CardType, CardTag, State, StoreLike, PowerType, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, StateUtils, SuperType } from '../../game';
import { RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class BlisseyV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_V ];

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 250;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Natural Cure',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Whenever you attach an Energy card from your hand to this Pokémon, it recovers from all Special Conditions.'
  }];

  public attacks = [{
    name: 'Blissful Blast',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: 'This attack does 30 more damage for each Energy attached to this Pokémon. If you did any damage with this attack, you may attach up to 3 Energy cards from your discard pile to this Pokémon.'
  }];

  public set: string = 'CRE';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '119';

  public name: string = 'Blissey V';

  public fullName: string = 'Blissey V CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = effect.target.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

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

      if (effect instanceof RemoveSpecialConditionsEffect && effect.target.cards.includes (this)) {
        // Heal conditions
        effect.target.specialConditions = [];
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const pokemonCard = effect.target.getPokemonCard();

      const checkProvidedEnergyEffect2 = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect2);
      const energyCount2 = checkProvidedEnergyEffect2.energyMap.reduce((left, p) => left + p.provides.length, 0);
    
      effect.damage += energyCount2 * 30;

      if (pokemonCard !== this) {
        return state;
      }

      const energyCards = player.discard.cards.filter(c => c.superType === SuperType.ENERGY);
      const maxEnergyCards = Math.min(3, energyCards.length);

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: maxEnergyCards }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }
    return state;
  }
}

