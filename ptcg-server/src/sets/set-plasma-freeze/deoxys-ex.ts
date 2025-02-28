import { Attack, CardTag, CardType, EnergyCard, GamePhase, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class DeoxysEX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public tags: string[] = [CardTag.POKEMON_EX, CardTag.TEAM_PLASMA];
  public hp: number = 170;
  public weakness: Weakness[] = [{ type: P }];
  public retreat: CardType[] = [C, C];

  public powers: Power[] = [{
    name: 'Power Connect',
    powerType: PowerType.ABILITY,
    text: 'Your Team Plasma Pokémon\'s attacks (excluding Deoxys-EX) do 10 more damage to the Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks: Attack[] = [{
    name: 'Helix Force',
    cost: [P, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If this Pokémon has any Plasma Energy attached to it, ' +
      'this attack does 30 more damage for each Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Deoxys EX';
  public fullName: string = 'Deoxys EX PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      const checkOpponentEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkEnergy);

      let hasPlasmaEnergy: boolean = false;
      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.name === 'Plasma Energy') {
          hasPlasmaEnergy = true;
        }
      });

      if (hasPlasmaEnergy) {
        store.reduceEffect(state, checkOpponentEnergy);
        const opponentEnergyCount = checkOpponentEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);
        effect.damage += opponentEnergyCount * 30;
      }
    }

    if (effect instanceof DealDamageEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);
      const source = effect.source.getPokemonCard() as PokemonCard;

      if (state.phase === GamePhase.ATTACK &&
        source.tags.includes(CardTag.TEAM_PLASMA) && source.name !== 'Deoxys EX' &&
        effect.target === opponent.active && effect.damage > 0 && !IS_ABILITY_BLOCKED(store, state, player, this)
      ) {
        effect.damage += 10;
      }
    }
    return state;
  }
}