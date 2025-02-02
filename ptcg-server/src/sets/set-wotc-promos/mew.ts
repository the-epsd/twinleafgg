import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SelectPrompt, SlotType, State, StateUtils } from '../../game';
import { StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Mew extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Psywave',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: 'Does 10 damage times the number of Energy cards attached to the Defending Pokémon.'
    },
    {
      name: 'Devolution Beam',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 0,
      text: 'Choose an evolved Pokémon (your own or your opponent\'s). Return the highest Stage Evolution card on that Pokémon to its player\'s hand. That Pokémon is no longer Asleep, Confused, Paralyzed, or Poisoned, or anything else that might be the result of an attack (just as if you had evolved it).'
    }
  ];

  public set: string = 'PR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '8';

  public name: string = 'Mew';

  public fullName: string = 'Mew PR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage = energyCount * 10;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.DISCARD_AND_DRAW,
          action: () => {

            //player
            const blocked: CardTarget[] = [];
            opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
              if (card.stage == Stage.BASIC) {
                blocked.push(target);
              }
            });

            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
              PlayerType.TOP_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { blocked: blocked, allowCancel: false }
            ), result => {
              const cardList = result.length > 0 ? result[0] : null;
              if (cardList !== null) {
                const pokemons = cardList.getPokemons();
                const latestEvolution = pokemons.slice(-1)[0];

                cardList.moveCardsTo([latestEvolution], opponent.hand);
                cardList.clearEffects();
              }
            });

          }
        },
        {
          message: GameMessage.SWITCH_POKEMON,
          action: () => {

            //player
            const blocked2: CardTarget[] = [];
            player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
              if (card.stage == Stage.BASIC) {
                blocked2.push(target);
              }
            });

            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { blocked: blocked2, allowCancel: false }
            ), result => {
              const cardList = result.length > 0 ? result[0] : null;
              if (cardList !== null) {
                const pokemons = cardList.getPokemons();
                const latestEvolution = pokemons.slice(-1)[0];

                cardList.moveCardsTo([latestEvolution], player.hand);
                cardList.clearEffects();
              }
            });
          }
        }
      ];
      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }
    return state;
  }



}