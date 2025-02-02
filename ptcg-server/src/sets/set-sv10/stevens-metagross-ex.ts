import { AttachEnergyPrompt, CardTarget, GameError, GameMessage, PlayerType, PokemonCard, PowerType, ShuffleDeckPrompt, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect, PowerEffect } from '../../game/store/effects/game-effects';

function* useExboot(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const blocked = player.deck.cards
    .filter(c => c.name !== 'Psychic Energy' && c.name !== 'Metal Energy')
    .map(c => player.deck.cards.indexOf(c));

  const blockedTo: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {

    const checkPokemonTypeEffect = new CheckPokemonTypeEffect(cardList);
    store.reduceEffect(state, checkPokemonTypeEffect);

    if (!checkPokemonTypeEffect.cardTypes.includes(CardType.PSYCHIC) &&
      !checkPokemonTypeEffect.cardTypes.includes(CardType.METAL)) {
      blockedTo.push(target);
    }
  })

  yield store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.deck,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { allowCancel: false, min: 0, max: 2, blocked, blockedTo }
  ), transfers => {
    transfers = transfers || [];
    for (const transfer of transfers) {

      if (transfers.length > 1) {
        if (transfers[0].card.name === transfers[1].card.name) {
          throw new GameError(GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
        }
      }

      const target = StateUtils.getTarget(state, player, transfer.to);
      player.deck.moveCardTo(transfer.card, target);
      next();
    }
  });
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class StevensMetagrossex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Steven\'s Metang';
  public tags: CardTag[] = [CardTag.STEVENS, CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 340;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Exboot',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: ' Once during your turn, you may search your deck for a Basic [P] Energy card ' +
      'and a Basic [M] Energy card and attach them to your [P] Pokémon or [M] Pokémon ' +
      'in any way you like. Then, shuffle your deck.'
  }]
  public attacks = [{ name: 'Metal Stop', cost: [M, C, C], damage: 200, text: '' }];

  public regulationMark: string = 'I';
  public set: string = 'SVOD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Steven\'s Metagross ex';
  public fullName: string = 'Steven\'s Metagross ex SVOD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useExboot(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
