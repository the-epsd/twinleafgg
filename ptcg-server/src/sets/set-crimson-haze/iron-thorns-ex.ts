import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class IronThornsex extends PokemonCard {

  public tags = [ CardTag.POKEMON_ex, CardTag.FUTURE ];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Ability: Initialize',
    powerType: PowerType.ABILITY,
    text: 'While this Pokémon is in the Active Spot, Pokémon with a Rule Box in play (except any Future Pokémon) don\'t have any Abilities.'
  }];

  public attacks = [
    {
      name: 'Bolt Cyclone',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 140,
      text: 'Move 1 Energy from this Pokémon to 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'SV5a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '33';

  public name: string = 'Iron Thorns ex';

  public fullName: string = 'Iron Thorns ex SV5a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect) {

      const pokemonCard = effect.card;

      if (pokemonCard.tags.includes (CardTag.POKEMON_ex && CardTag.FUTURE)) {
        return state;
      }

      if (pokemonCard.tags.includes(CardTag.POKEMON_V) ||
          pokemonCard.tags.includes(CardTag.POKEMON_VMAX) ||
          pokemonCard.tags.includes(CardTag.POKEMON_VSTAR) ||
          pokemonCard.tags.includes(CardTag.POKEMON_ex) ||
          pokemonCard.tags.includes(CardTag.RADIANT)) {
        // pokemonCard.powers.length = 0;
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

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
          [ SlotType.BENCH ],
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 1, max: 1 }
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
    return state;
  }
}