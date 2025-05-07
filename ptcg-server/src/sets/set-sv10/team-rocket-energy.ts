import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameError, GameMessage, PlayerType } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyMap } from '../../game/store/prompts/choose-energy-prompt';
import { CardList } from '../../game/store/state/card-list';
import { Card } from '../../game/store/card/card';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class TeamRocketEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public tags: CardTag[] = [CardTag.TEAM_ROCKET];

  public energyType = EnergyType.SPECIAL;

  public regulationMark = 'I';

  public set: string = 'SV10';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public name = 'Team Rocket Energy';

  public fullName = 'Team Rocket Energy SV10';

  public text = `This card can only be attached to a Team Rocket's Pokémon. If this card is attached to anything other than a Team Rocket's Pokémon, discard this card.
  
  While this card is attached to a Pokémon, this card provides 2 in any combination of [P] and [D] Energy`;

  private getExistingEnergy(source: CardList): EnergyMap[] {
    return source.cards
      .filter((card: Card) => card instanceof EnergyCard && card !== this)
      .map((card: Card) => ({
        card: card as EnergyCard,
        provides: (card as EnergyCard).provides
      }));
  }

  private countEnergyType(energy: EnergyMap[], type: CardType): number {
    return energy.reduce((count, e) => {
      return count + e.provides.filter(p => p === type).length;
    }, 0);
  }

  private getEnergyToProvide(attackCost: CardType[], existingEnergy: EnergyMap[]): CardType[] {
    const needsPsychic = attackCost.includes(CardType.PSYCHIC);
    const needsDark = attackCost.includes(CardType.DARK);

    console.log('Attack cost:', attackCost);
    console.log('Needs Psychic:', needsPsychic);
    console.log('Needs Dark:', needsDark);
    console.log('Existing energy:', existingEnergy.map(e => ({
      card: e.card.name,
      provides: e.provides
    })));

    if (!needsPsychic && !needsDark) {
      console.log('Providing COLORLESS, COLORLESS (no type needed)');
      return [CardType.COLORLESS, CardType.COLORLESS];
    }

    const psychicCount = this.countEnergyType(existingEnergy, CardType.PSYCHIC);
    const darkCount = this.countEnergyType(existingEnergy, CardType.DARK);
    const requiredPsychic = attackCost.filter(c => c === CardType.PSYCHIC).length;
    const requiredDark = attackCost.filter(c => c === CardType.DARK).length;

    console.log('Existing Psychic count:', psychicCount);
    console.log('Existing Dark count:', darkCount);
    console.log('Required Psychic:', requiredPsychic);
    console.log('Required Dark:', requiredDark);

    const hasEnoughPsychic = !needsPsychic || psychicCount >= requiredPsychic;
    const hasEnoughDark = !needsDark || darkCount >= requiredDark;

    console.log('Has enough Psychic:', hasEnoughPsychic);
    console.log('Has enough Dark:', hasEnoughDark);

    if (hasEnoughPsychic && hasEnoughDark) {
      console.log('Providing COLORLESS, COLORLESS (enough of both types)');
      return [CardType.COLORLESS, CardType.COLORLESS];
    }

    if (needsPsychic && needsDark) {
      if (!hasEnoughPsychic && !hasEnoughDark) {
        console.log('Providing PSYCHIC, DARK (needs both)');
        return [CardType.PSYCHIC, CardType.DARK];
      }
      if (!hasEnoughPsychic) {
        console.log('Providing PSYCHIC, PSYCHIC (needs Psychic)');
        return [CardType.PSYCHIC, CardType.PSYCHIC];
      }
      console.log('Providing DARK, DARK (needs Dark)');
      return [CardType.DARK, CardType.DARK];
    }

    if (needsPsychic && !hasEnoughPsychic) {
      console.log('Providing PSYCHIC, PSYCHIC (needs Psychic)');
      return [CardType.PSYCHIC, CardType.PSYCHIC];
    }

    if (needsDark && !hasEnoughDark) {
      console.log('Providing DARK, DARK (needs Dark)');
      return [CardType.DARK, CardType.DARK];
    }

    console.log('Providing COLORLESS, COLORLESS (default)');
    return [CardType.COLORLESS, CardType.COLORLESS];
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Prevent attaching to non Team Rocket's Pokemon
    if (effect instanceof AttachEnergyEffect) {
      if (effect.energyCard === this && !effect.target.getPokemonCard()?.tags.includes(CardTag.TEAM_ROCKET)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Discard card when not attached to Team Rocket's Pokemon
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this) || IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
            return;
          }

          const pokemonCard = cardList.getPokemonCard();
          if (pokemonCard && !pokemonCard.tags.includes(CardTag.TEAM_ROCKET)) {
            console.log('Discarding Team Rocket Energy from non-Team Rocket Pokémon:', pokemonCard.name);
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      try {
        const energyEffect = new EnergyEffect(effect.player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      const pokemonCard = effect.source.getPokemonCard();
      if (!pokemonCard || !(pokemonCard instanceof PokemonCard)) {
        return state;
      }

      console.log('Checking energy provision for:', pokemonCard.name);
      const attackCost = pokemonCard.attacks[0]?.cost || [];
      const existingEnergy = this.getExistingEnergy(effect.source);
      const energyToProvide = this.getEnergyToProvide(attackCost, existingEnergy);

      console.log('Final energy provided:', energyToProvide);
      effect.energyMap.push({
        card: this,
        provides: energyToProvide
      });
    }
    return state;
  }
}
