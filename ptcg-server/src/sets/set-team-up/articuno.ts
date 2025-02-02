import { AttachEnergyPrompt, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { SupporterEffect } from '../../game/store/effects/play-card-effects';

export class Articuno extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 110;

  public powers = [{
    name: 'Blizzard Veil',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is your Active Pokémon, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your Benched [W] Pokémon.'
  }];

  public attacks = [{
    name: 'Cold Cyclone',
    cost: [CardType.WATER, CardType.WATER],
    damage: 70,
    text: 'Move 2 [W] Energy from this Pokémon to 1 of your Benched Pokémon.'
  }];
  
  public weakness = [{ type: CardType.LIGHTNING }];
  
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TEU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public name: string = 'Articuno';

  public fullName: string = 'Articuno TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 2, max: 2, validCardTypes: [CardType.WATER, CardType.ANY, CardType.WLFM, CardType.GRW] }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
      
    }
    
    if (effect instanceof SupporterEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const target = effect.target;
      
      let isArticunoInPlay = false;
      let targetIsWaterPokemon = false;

      if (opponent.active.cards.includes(this)) {
        isArticunoInPlay = true;
      }
      
      if (!!target && target instanceof PokemonCardList) {
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(target as PokemonCardList);
        store.reduceEffect(state, checkPokemonTypeEffect);
        
        targetIsWaterPokemon = checkPokemonTypeEffect.cardTypes.includes(CardType.WATER);
      }

      if (!isArticunoInPlay || !targetIsWaterPokemon) {
        return state;
      }

      // Try reducing ability for opponent
      try {
        const stub = new PowerEffect(opponent, {
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
    
    return state;
  }
}