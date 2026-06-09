import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card, CardList, EnergyCard, PokemonCard, TrainerCard } from 'ptcg-server';
import { CardType, EnergyType, PowerType, SuperType, TrainerType } from 'ptcg-server';
import { CardSwapDialog } from './CardSwapDialog';
import { EnergyTypeIcon } from './EnergyTypeIcon';
import { isFavoriteCard, toggleFavoriteCard } from './favoriteCardsStorage';
import {
  getCardRuleText,
  getCardsWithSameName,
  getComputedHp,
  getCurrentHp,
  getDisplayAttacks,
  getDisplayPowers,
  isToolCardInList,
  getDisplayTagLabels,
  parseCardName,
  powerTypeLabel,
  stageLabel,
  transformEnergyText,
} from './cardInfoUtils';
import { HoverHighlight } from './HoverHighlight';
import { CardInfoImageColumn } from './CardInfoImageColumn';
import styles from './CardInfoPane.module.css';
import { TrainerTypeStrip } from './TrainerTypeStrip';

function IconHeart({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 18.24 4 15.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 6.89-3.14 9.74-7.9 13.05z" />
    </svg>
  );
}

export type CardInfoPaneOptions = {
  enableAttack?: boolean;
  enableTrainer?: boolean;
  enableRetreat?: boolean;
  enableAbility?: {
    useWhenInPlay?: boolean;
    useFromHand?: boolean;
    useFromDiscard?: boolean;
  };
};

/** Matches Angular `CardInfoPaneAction` (card is always the viewed card). */
export type CardInfoTableAction = {
  card: Card;
  attack?: string;
  ability?: string;
  trainer?: boolean;
  retreat?: boolean;
};

export type CardInfoPaneProps = {
  card: Card;
  /** In-play list (active/bench Pokémon) — used for HP bonus and damage like Angular `card-info-pane`. */
  cardList?: CardList;
  facedown: boolean;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  isInGame: boolean;
  options?: CardInfoPaneOptions;
  showTags?: boolean;
  cardTextKerning?: number;
  onCardSwap?: (event: { originalCard: Card; replacementCard: Card }) => void;
  /** In-game: ability / attack / retreat / trainer (stadium) selection for the 3D board. */
  onTableAction?: (action: CardInfoTableAction) => void;
  /** Parent (e.g. CardInfoPopup) renders {@link CardInfoImageColumn} beside this pane. */
  omitScanColumn?: boolean;
  swapOpen?: boolean;
  onSwapOpenChange?: (open: boolean) => void;
};

export function CardInfoPane({
  card,
  cardList,
  facedown,
  catalog,
  getScanUrl,
  isInGame,
  options = {},
  showTags = false,
  cardTextKerning = 0,
  onCardSwap,
  onTableAction,
  omitScanColumn = false,
  swapOpen: swapOpenProp,
  onSwapOpenChange,
}: CardInfoPaneProps) {
  const { t } = useTranslation();
  const [localSwapOpen, setLocalSwapOpen] = useState(false);
  const swapOpen = omitScanColumn ? (swapOpenProp ?? false) : localSwapOpen;
  const setSwapOpen = omitScanColumn
    ? (v: boolean) => onSwapOpenChange?.(v)
    : setLocalSwapOpen;
  const [, favBump] = useState(0);
  const bumpFavorite = useCallback(() => favBump((n) => n + 1), []);

  const alternatives = useMemo(() => getCardsWithSameName(catalog, card), [catalog, card]);

  function trainerSubtitle(trainerT: TrainerType): string {
    switch (trainerT) {
      case TrainerType.SUPPORTER:
        return t('CARDS_SUPPORTER');
      case TrainerType.STADIUM:
        return t('CARDS_STADIUM');
      case TrainerType.TOOL:
        return t('CARDS_POKEMON_TOOL');
      default:
        return t('CARDS_ITEM');
    }
  }

  const kerningStyle = { letterSpacing: `${cardTextKerning}px` } as const;

  const displayPowers = useMemo(() => getDisplayPowers(card, cardList), [card, cardList]);
  const displayAttacks = useMemo(() => getDisplayAttacks(card, cardList), [card, cardList]);

  const enabledAbilities = useMemo(() => {
    const m: Record<string, boolean> = {};
    const e = options.enableAbility;
    if (!e) return m;
    for (const power of displayPowers) {
      const ok =
        !!(e.useWhenInPlay && power.useWhenInPlay) ||
        !!(e.useFromDiscard && power.useFromDiscard) ||
        !!(e.useFromHand && power.useFromHand);
      if (ok) m[power.name] = true;
    }
    return m;
  }, [displayPowers, options.enableAbility]);

  const viewingToolCard = isToolCardInList(card, cardList);
  const shouldEnableAttacks =
    !!options.enableAttack && !viewingToolCard && displayAttacks.length > 0;
  const shouldEnableRetreat = !!(card.superType === SuperType.POKEMON && options.enableRetreat);
  const enableTrainerPlay = !!options.enableTrainer;

  const parsed = parseCardName(card.name);
  const pokemon = card as PokemonCard;
  const trainer = card as TrainerCard;
  const energy = card as EnergyCard;

  const tagLabels = getDisplayTagLabels(card, showTags);

  const onSwapSelect = (replacement: Card) => {
    setSwapOpen(false);
    onCardSwap?.({ originalCard: card, replacementCard: replacement });
  };

  const favoriteToggle = (
    <button
      type="button"
      className={styles.favoriteButton}
      title={isFavoriteCard(card) ? t('FAVORITE_REMOVE') : t('FAVORITE_ADD')}
      onClick={() => {
        toggleFavoriteCard(card);
        bumpFavorite();
      }}
    >
      <IconHeart filled={isFavoriteCard(card)} />
    </button>
  );

  return (
    <div className={omitScanColumn ? styles.paneEmbed : styles.pane}>
      {!omitScanColumn ? (
        <CardInfoImageColumn
          card={card}
          catalog={catalog}
          facedown={facedown}
          getScanUrl={getScanUrl}
          isInGame={isInGame}
          onSwapClick={() => setSwapOpen(true)}
        />
      ) : null}

      {!facedown && card.superType === SuperType.POKEMON && (
        <div className={styles.textCol}>
          <div className={styles.title}>
            {parsed.prefix ? (
              <>
                <span className={styles.subtitleSetCode}>{parsed.prefix}</span>
                <span>{parsed.rest}</span>
              </>
            ) : (
              <span>{card.name}</span>
            )}
            <span className={styles.subtitleSetCode}>
              {card.set} {card.setNumber}
            </span>
            <div className={styles.spacer} />
            <div className={styles.subtitleHp}>
              <span className={styles.subtitleHpUnit}>{t('CARDS_HP')}</span>
              <span className={styles.subtitleHpValue}>
                {getCurrentHp(card, cardList) ?? '—'}/{getComputedHp(card, cardList) ?? '—'}
              </span>
            </div>
            <div className={styles.subtitleCardType}>
              <EnergyTypeIcon type={pokemon.cardType} style={{ transform: 'translateY(12px)' }} />
              {pokemon.additionalCardTypes?.map((t) => (
                <EnergyTypeIcon key={String(t)} type={t} style={{ transform: 'translateY(12px)' }} />
              ))}
            </div>
          </div>
          <div className={styles.subtitle}>
            <div className={styles.subtitleStage}>{stageLabel(pokemon)}</div>
            <div className={styles.spacer} />
            {tagLabels.length > 0 && (
              <>
                <div className={styles.subtitleTags}>
                  {tagLabels.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={styles.spacer} />
              </>
            )}
            {pokemon.evolvesFrom ? (
              <div className={styles.subtitleEvolvesFrom}>{t('CARDS_EVOLVES_FROM', { name: pokemon.evolvesFrom })}</div>
            ) : null}
            {pokemon.evolvesTo && pokemon.evolvesTo.length > 0 ? (
              <div className={styles.subtitleEvolvesTo}>Evolves into {pokemon.evolvesTo.join(', ')}</div>
            ) : null}
          </div>

          {displayPowers.map((power) => (
            <HoverHighlight
              key={power.name}
              enabled={!!enabledAbilities[power.name]}
              onClick={
                onTableAction && enabledAbilities[power.name]
                  ? () => onTableAction({ card, ability: power.name })
                  : undefined
              }
            >
              <div className={styles.power}>
                <div className={styles.powerHeader}>
                  <div className={styles.powerType}>
                    {powerTypeLabel(power.powerType) ? (
                      <span className={power.powerType === PowerType.POKEBODY ? styles.pokeBody : styles.ability}>
                        {powerTypeLabel(power.powerType)}
                      </span>
                    ) : null}
                  </div>
                  <div className={styles.powerName}>{power.name}</div>
                </div>
                <div
                  className={styles.cardText}
                  style={kerningStyle}
                  dangerouslySetInnerHTML={{ __html: transformEnergyText(power.text ?? '') }}
                />
              </div>
            </HoverHighlight>
          ))}

          {displayAttacks.map((attack) => (
            <HoverHighlight
              key={attack.name}
              enabled={shouldEnableAttacks}
              onClick={
                onTableAction && shouldEnableAttacks
                  ? () => onTableAction({ card, attack: attack.name })
                  : undefined
              }
            >
              <div className={styles.attack}>
                <div className={styles.attackHeader}>
                  <div className={styles.attackCost}>
                    {attack.cost.length === 0 ? (
                      <EnergyTypeIcon type={CardType.NONE} style={{ transform: 'translateY(3px)' }} />
                    ) : (
                      attack.cost.map((cost, i) => (
                        <EnergyTypeIcon
                          key={`${attack.name}-cost-${i}`}
                          type={cost}
                          style={{ transform: 'translateY(3px)' }}
                        />
                      ))
                    )}
                  </div>
                  <div className={styles.attackName}>{attack.name}</div>
                  <div className={styles.spacer} />
                  {attack.damage > 0 ? (
                    <div className={styles.attackDamage}>
                      {attack.damage}
                      {attack.damageCalculation ? ` ${attack.damageCalculation}` : ''}
                    </div>
                  ) : null}
                </div>
                <div
                  className={styles.cardText}
                  style={kerningStyle}
                  dangerouslySetInnerHTML={{ __html: transformEnergyText(attack.text ?? '') }}
                />
              </div>
            </HoverHighlight>
          ))}

          <div className={styles.stats}>
            <div className={styles.statsItem}>
              <div className={styles.statsItemHeader}>{t('CARDS_WEAKNESS')}</div>
              {(pokemon.weakness ?? []).map((w, i) => (
                <div key={i} className={styles.statsItemValue}>
                  <div className={styles.statsItemValueType}>
                    <EnergyTypeIcon type={w.type} style={{ transform: 'translateY(5px)' }} />
                  </div>
                  <div className={styles.statsItemValueModifier}>{w.value ? `+${w.value}` : 'x2'}</div>
                </div>
              ))}
            </div>
            <div className={styles.statsItem}>
              <div className={styles.statsItemHeader}>{t('CARDS_RESISTANCE')}</div>
              {(pokemon.resistance ?? []).map((r, i) => (
                <div key={i} className={styles.statsItemValue}>
                  <div className={styles.statsItemValueType}>
                    <EnergyTypeIcon type={r.type} style={{ transform: 'translateY(5px)' }} />
                  </div>
                  <div className={styles.statsItemValueModifier}>{r.value}</div>
                </div>
              ))}
            </div>
            <HoverHighlight
              enabled={shouldEnableRetreat}
              className={styles.statsHighlight}
              onClick={
                onTableAction && shouldEnableRetreat
                  ? () => onTableAction({ card, retreat: true })
                  : undefined
              }
            >
              <div className={styles.statsItem}>
                <div className={styles.statsItemHeader}>{t('CARDS_RETREAT_COST')}</div>
                <div className={styles.statsItemValue}>
                  <div className={styles.statsItemValueType}>
                    {(pokemon.retreat ?? []).map((cost, i) => (
                      <EnergyTypeIcon key={i} type={cost} style={{ transform: 'translateY(5px)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </HoverHighlight>
          </div>

          {getCardRuleText(card) ? (
            <div className={styles.power}>
              <div className={styles.powerHeader}>
                <div className={styles.powerName}>{card.name}</div>
              </div>
              <div
                className={styles.cardText}
                style={kerningStyle}
                dangerouslySetInnerHTML={{ __html: transformEnergyText(getCardRuleText(card)) }}
              />
            </div>
          ) : null}
        </div>
      )}

      {!facedown && card.superType === SuperType.ENERGY && (
        <div className={styles.textCol}>
          <div className={styles.title}>
            <span>{card.name}</span>{' '}
            <span className={styles.subtitleSetCode}>
              {card.set} {card.setNumber}
            </span>
            {!isInGame ? favoriteToggle : null}
          </div>
          <div className={styles.subtitle}>
            <div className={styles.subtitleStage}>
              {energy.energyType === EnergyType.BASIC ? t('CARDS_BASIC_ENERGY') : t('CARDS_SPECIAL_ENERGY')}
            </div>
            <div className={styles.spacer} />
            <div className={styles.subtitleCardType}>
              <TrainerTypeStrip />
            </div>
          </div>
          {getCardRuleText(card) ? (
            <div className={styles.power}>
              <div className={styles.powerHeader}>
                <div className={styles.powerName}>{card.name}</div>
              </div>
              <div
                className={styles.cardText}
                style={kerningStyle}
                dangerouslySetInnerHTML={{ __html: transformEnergyText(getCardRuleText(card)) }}
              />
            </div>
          ) : null}
          {getDisplayPowers(card).map((power) => (
            <HoverHighlight
              key={power.name}
              enabled={!!enabledAbilities[power.name]}
              onClick={
                onTableAction && enabledAbilities[power.name]
                  ? () => onTableAction({ card, ability: power.name })
                  : undefined
              }
            >
              <div className={styles.power}>
                <div className={styles.powerHeader}>
                  <div className={styles.powerType}>
                    {powerTypeLabel(power.powerType) ? (
                      <span className={styles.ability}>{powerTypeLabel(power.powerType)}</span>
                    ) : null}
                  </div>
                  <div className={styles.powerName}>{power.name}</div>
                </div>
                <div
                  className={styles.cardText}
                  style={kerningStyle}
                  dangerouslySetInnerHTML={{ __html: transformEnergyText(power.text ?? '') }}
                />
              </div>
            </HoverHighlight>
          ))}
        </div>
      )}

      {!facedown && card.superType === SuperType.TRAINER && (
        <div className={styles.textCol}>
          <div className={styles.title}>
            <span>{card.name}</span>{' '}
            <span className={styles.subtitleSetCode}>
              {card.set} {card.setNumber}
            </span>
            {!isInGame ? favoriteToggle : null}
          </div>
          <div className={styles.subtitle}>
            <div className={styles.subtitleStage}>{trainerSubtitle(trainer.trainerType)}</div>
            <div className={styles.spacer} />
            <div className={styles.subtitleCardType}>
              <TrainerTypeStrip type={trainer.trainerType} />
            </div>
          </div>
          {getDisplayPowers(card).map((power) => (
            <HoverHighlight
              key={power.name}
              enabled={!!enabledAbilities[power.name]}
              onClick={
                onTableAction && enabledAbilities[power.name]
                  ? () => onTableAction({ card, ability: power.name })
                  : undefined
              }
            >
              <div className={styles.power}>
                <div className={styles.powerHeader}>
                  <div className={styles.powerType}>
                    {powerTypeLabel(power.powerType) ? (
                      <span className={styles.ability}>{powerTypeLabel(power.powerType)}</span>
                    ) : null}
                  </div>
                  <div className={styles.powerName}>{power.name}</div>
                </div>
                <div
                  className={styles.cardText}
                  style={kerningStyle}
                  dangerouslySetInnerHTML={{ __html: transformEnergyText(power.text ?? '') }}
                />
              </div>
            </HoverHighlight>
          ))}
          {getDisplayAttacks(card).map((attack) => (
            <HoverHighlight
              key={attack.name}
              enabled={shouldEnableAttacks}
              onClick={
                onTableAction && shouldEnableAttacks
                  ? () => onTableAction({ card, attack: attack.name })
                  : undefined
              }
            >
              <div className={styles.attack}>
                <div className={styles.attackHeader}>
                  <div className={styles.attackCost}>
                    {attack.cost.length === 0 ? <EnergyTypeIcon type={CardType.NONE} /> : null}
                    {attack.cost.map((cost, i) => (
                      <EnergyTypeIcon key={i} type={cost} />
                    ))}
                  </div>
                  <div className={styles.attackName}>{attack.name}</div>
                  <div className={styles.spacer} />
                  {attack.damage > 0 ? <div className={styles.attackDamage}>{attack.damage}</div> : null}
                </div>
                <div
                  className={styles.cardText}
                  style={kerningStyle}
                  dangerouslySetInnerHTML={{ __html: transformEnergyText(attack.text ?? '') }}
                />
              </div>
            </HoverHighlight>
          ))}
          <HoverHighlight
            enabled={enableTrainerPlay}
            onClick={
              onTableAction && enableTrainerPlay ? () => onTableAction({ card, trainer: true }) : undefined
            }
          >
            {getCardRuleText(card) ? (
              <div className={styles.power}>
                <div className={styles.powerHeader}>
                  <div className={styles.powerName}>{card.name}</div>
                </div>
                <div
                  className={styles.cardText}
                  style={kerningStyle}
                  dangerouslySetInnerHTML={{ __html: transformEnergyText(getCardRuleText(card)) }}
                />
              </div>
            ) : null}
          </HoverHighlight>
        </div>
      )}

      {!facedown && card.superType === SuperType.NONE && (
        <div className={styles.textCol}>
          <div className={styles.title}>{card.name}</div>
        </div>
      )}

      {facedown && (
        <div className={styles.textCol}>
          <div className={styles.title}>{t('CARDS_UNKNOWN')}</div>
          <div className={styles.power}>
            <div className={styles.cardText}>{t('CARDS_FACE_DOWN_HINT')}</div>
          </div>
        </div>
      )}

      <CardSwapDialog
        open={swapOpen}
        onClose={() => setSwapOpen(false)}
        currentCard={card}
        alternativeCards={alternatives}
        getScanUrl={getScanUrl}
        onSelect={onSwapSelect}
      />
    </div>
  );
}
