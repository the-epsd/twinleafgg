import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { ABILITY_USED, ADD_MARKER, COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Venusaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Ivysaur';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Harvest Bounty',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if you attach an Energy card to your Active Pokémon as part of your turn, you may attach an additional Energy card to that Pokémon at the same time. This power can\'t be used if Venusaur is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Body Slam',
    cost: [G, G, C, C],
    damage: 40,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'EX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Venusaur';
  public fullName: string = 'Venusaur EX';

  public readonly HARVEST_BOUNTY_MARKER = 'HARVEST_BOUNTY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      const active = effect.player.active;

      let isVenusaurInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isVenusaurInPlay = true;
        }
      });

      if (!isVenusaurInPlay) {
        return state;
      }

      if (HAS_MARKER(this.HARVEST_BOUNTY_MARKER, player, this)) {
        return state;
      }

      const energyInHand = player.hand.cards.filter(c => c.superType === SuperType.ENERGY && c !== effect.energyCard);

      if (!IS_POKEPOWER_BLOCKED(store, state, player, this) && energyInHand.length > 0) {
        if (owner === player && effect.target === active) {
          CONFIRMATION_PROMPT(store, state, player, result => {
            if (result) {

              // Once per turn
              ADD_MARKER(this.HARVEST_BOUNTY_MARKER, player, this);
              ABILITY_USED(player, this);

              store.prompt(state, new AttachEnergyPrompt(
                player.id,
                GameMessage.ATTACH_ENERGY_CARDS,
                player.hand,
                PlayerType.BOTTOM_PLAYER,
                [SlotType.ACTIVE],
                { superType: SuperType.ENERGY },
                { allowCancel: false, min: 1, max: 1 },
              ), transfers => {
                transfers = transfers || [];

                if (transfers.length === 0) {
                  return state;
                }

                // Attach second energy
                for (const transfer of transfers) {
                  const target = StateUtils.getTarget(state, player, transfer.to);
                  const energyCard = transfer.card as EnergyCard;
                  const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
                  store.reduceEffect(state, attachEnergyEffect);
                }
              });
            }
          });
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}