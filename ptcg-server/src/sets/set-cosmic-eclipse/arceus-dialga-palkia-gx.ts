import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, AttachEnergyPrompt, CardTarget, GameMessage, PlayerType, ShuffleDeckPrompt, SlotType, StateUtils, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

function* useUltimateRay(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (!cardList.vPokemon()) {
      blocked.push(target);
    }
  });

  yield store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.deck,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { allowCancel: false, min: 0, max: 3, blockedTo: blocked }
  ), transfers => {
    transfers = transfers || [];
    for (const transfer of transfers) {
      const target = StateUtils.getTarget(state, player, transfer.to);
      player.deck.moveCardTo(transfer.card, target);
      next();
    }
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);

  });
}

export class ArceusDialgaPalkiaGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 280;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Ultimate Ray',
      cost: [CardType.WATER, CardType.METAL, CardType.COLORLESS],
      damage: 150,
      text: 'Search your deck for up to 3 basic Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
    },
    {
      name: 'Altered Creation GX',
      cost: [CardType.METAL],
      damage: 0,
      text: 'For the rest of this game, your Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). If this Pokémon has at least 1 extra Water Energy attached to it (in addition to this attack\'s cost), when your opponent\'s Active Pokémon is Knocked Out by damage from those attacks, take 1 more Prize card. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'CEC';

  public name = 'Arceus & Dialga & Palkia GX';

  public fullName = 'Arceus & Dialga & Palkia GX CEC';

  public setNumber: string = '156';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useUltimateRay(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // Check if player has used altered creation
      if (player.usedGX == true) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.usedGX = true;
      player.alteredCreationDamage = true;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[1]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Filter for only Water Energy
      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER));

      // Get number of extra Water energy  
      const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;

      // Apply damage boost based on extra Water energy
      if (extraWaterEnergy >= 1) {
        player.usedAlteredCreation == true;
      }
    }
    return state;
  }
}
