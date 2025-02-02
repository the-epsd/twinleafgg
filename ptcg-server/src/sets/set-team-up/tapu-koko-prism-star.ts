import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, CardTag } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class TapuKokoPrismStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public tags = [CardTag.PRISM_STAR];
  public hp: number = 130;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Dance of the Ancients',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, '
      + 'you may choose 2 of your Benched Pokémon and attach a [L] Energy card from your discard pile to each of them.'
      + 'If you do, discard all cards from this Pokémon and put it in the Lost Zone.'
  }];

  public attacks = [{
    name: 'Mach Bolt',
    cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
    damage: 120,
    text: ''
  }];

  public set = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name = 'Tapu Koko Prism Star';
  public fullName = 'Tapu Koko Prism Star TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);


      // Check to see if anything is blocking our Ability
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

      if (player.active.cards[0] == this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
      if (benchIndex === -1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.LIGHTNING);
      });

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { allowCancel: false, min: 1, max: 2, differentTargets: true }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {

            const pokemons = cardList.getPokemons();
            cardList.moveCardsTo(pokemons, player.lostzone);
            cardList.moveTo(player.discard);
            cardList.clearEffects();

          }
        });

        return state;
      });

    }


    return state;
  }
}