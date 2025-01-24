import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, StateUtils, GameMessage, Power, PowerType, ChooseEnergyPrompt, Card, PlayerType, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Slakingex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom: string = 'Vigoroth';

  public tags: string[] = [CardTag.POKEMON_EX];

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 340;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers: Power[] = [
    {
      name: 'Born to Slack',
      powerType: PowerType.ABILITY,
      text: 'If your opponent has no Pokemon ex or Pokemon V in play, this Pokemon can\'t attack.',
    }
  ];

  public attacks = [
    {
      name: 'Great Swing',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 280,
      text: 'Discard an Energy from this Pokemon.'
    }
  ];

  public set: string = 'SSP';

  public setNumber = '147';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Slaking ex';

  public fullName: string = 'Slaking ex SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check each of our opponent's Pokemon to see if they have an ex or V.
      let hasSpecialPokemon = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.POKEMON_ex) || card.tags.includes(CardTag.POKEMON_V)) {
          hasSpecialPokemon = true;
        }
      });

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // If we don't have a ex or V in play, block the attack.
      if (!hasSpecialPokemon) { throw new GameError(GameMessage.BLOCKED_BY_ABILITY); }
    }


    // Great Swing
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS],
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
