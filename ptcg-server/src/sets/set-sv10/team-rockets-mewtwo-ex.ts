import { PokemonCard, Stage, CardType, StoreLike, State, PokemonCardList, DiscardEnergyPrompt, GameError, GameMessage, EnergyType, PlayerType, SlotType, StateUtils, SuperType, CardTag, PowerType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect, UseAttackEffect } from "../../game/store/effects/game-effects";
import { IS_ABILITY_BLOCKED } from "../../game/store/prefabs/prefabs";


export class TeamRocketsMewtwoex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET, CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 280;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Power Saver',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can\'t attack unless you have 4 or more Team Rocket\'s Pokemon in play.'
  }];

  public attacks = [
    {
      name: 'Erasure Ball',
      cost: [P, P, C],
      damage: 160,
      damageCalculation: '+',
      text: 'You may discard up to 2 Energy from your Benched Pokémon. This attack does 60 more damage for each card you discarded this way.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '39';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Mewtwo';
  public fullName: string = 'Team Rocket\'s Mewtwo ex SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseAttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (!IS_ABILITY_BLOCKED) {
        // Count Team Rocket's Pokémon in play
        let teamRocketPokemonCount = 0;

        // Check active
        if (this.isTeamRocketPokemon(player.active)) {
          teamRocketPokemonCount++;
        }

        // Check bench
        player.bench.forEach(benchSlot => {
          if (benchSlot.cards.length > 0) {
            const pokemon = benchSlot.getPokemonCard();
            if (pokemon && this.isTeamRocketPokemon(benchSlot)) {
              teamRocketPokemonCount++;
            }
          }
        });

        // If less than 4 Team Rocket's Pokémon, prevent attack
        if (teamRocketPokemonCount < 4) {
          throw new GameError(GameMessage.CANNOT_USE_ATTACK);
        }
      }
    }

    // Handle Deletion Sphere attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new DiscardEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), transfers => {

        if (transfers === null) {
          return state;
        }

        const baseDamage = 160;
        const additionalDamage = transfers.length * 60;
        effect.damage = baseDamage + additionalDamage;

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = player.discard;
          source.moveCardTo(transfer.card, target);
        }

        return state;
      });
    }

    return state;
  }

  // Helper method to check if a Pokémon is a Team Rocket's Pokémon
  private isTeamRocketPokemon(pokemonList: PokemonCardList): boolean {
    const pokemon = pokemonList.getPokemonCard();
    if (!pokemon) return false;

    return pokemon.tags.includes(CardTag.TEAM_ROCKET);
  }
}
