import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, AttachEnergyPrompt, GameMessage, PlayerType, ShuffleDeckPrompt, SlotType, StateUtils, GameError, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

function* useUltimateRay(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  yield store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.deck,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { allowCancel: false, min: 0, max: 3 }
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
        throw new GameError(GameMessage.LABEL_GX_USED);
      }

      player.usedGX = true;
      player.alteredCreationDamage = true;

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Check if there's any Water energy attached
      const hasWaterEnergy = checkEnergy.energyMap.some(e =>
        e.provides.includes(CardType.WATER));

      if (hasWaterEnergy) {
        player.usedAlteredCreation == true;
        console.log('Used Altered Creation with Extra Water');
      }
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      // const opponent = StateUtils.getOpponent(state, player);

      if (player.alteredCreationDamage === true) {
        effect.damage += 30;
      }
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Check if the attack that caused the KnockOutEffect is "Amp You Very Much"
      if (player.usedAlteredCreation === true) {
        effect.prizeCount += 1;
      }
    }


    // if (effect instanceof PutDamageEffect && effect.source == effect.player.active) {
    //   const player = effect.player;
    //   const opponent = StateUtils.getOpponent(state, effect.player);

    //   if (effect.target == effect.source) {
    //     return state;
    //   }

    //   if (effect.target !== player.active && effect.target !== opponent.active) {
    //     return state;
    //   }

    //   if (effect.damageReduced) {
    //     // Damage already reduced, don't reduce again
    //     return state;
    //   }

    //   const targetCard = effect.target.getPokemonCard();
    //   if (targetCard && player.alteredCreationDamage) {
    //     effect.damage += 30;
    //     effect.damageReduced = true;
    //   }
    // }

    return state;
  }

}