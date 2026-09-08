import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { Card, CardList, Player, PokemonCard } from 'ptcg-server';
import {
  BoardEffect,
  CardTag,
  CardType,
  PokemonCardList,
  PowerType,
  SuperType,
} from 'ptcg-server';
import type { AbilityFocusAnchor } from '../BoardInteractionService';
import { BoardInteractionService } from '../BoardInteractionService';
import type { CardInfoPaneOptions, CardInfoTableAction } from '../../card-info/CardInfoPane';
import { EnergyTypeIcon } from '../../card-info/EnergyTypeIcon';
import { HoverHighlight } from '../../card-info/HoverHighlight';
import {
  CARD_INFO_ENERGY_ICON_SIZE,
  formatCardText,
  getCardRuleText,
  getDisplayAttacks,
  getDisplayPowers,
  getInPlayTransformCopy,
  isToolCardInList,
  powerTypeLabel,
} from '../../card-info/cardInfoUtils';
import { hasBothDualLegendHalvesInHand } from './dual-legend.utils';
import {
  CARD_RETREAT_PLATE_LOCAL_SIZE,
  CARD_TEXT_PLATE_LOCAL_SIZE,
} from './board3dAbilityFocusProjection';
import { cssMatrix3dForQuad } from './board3dCardInspectPlateTransform';
import paneStyles from '../../card-info/CardInfoPane.module.css';
import styles from './Board3dCardInfoOverlay.module.css';

export type Board3dCardInfoOverlayProps = {
  card: Card;
  cardList?: CardList;
  players?: Player[];
  facedown?: boolean;
  options?: CardInfoPaneOptions;
  boardInteraction: BoardInteractionService;
  onClose: () => void;
  onTableAction?: (action: CardInfoTableAction) => void | boolean;
};

/** Keep DOM layout aspect = card-local plate aspect so the warp does not squash text. */
const TEXT_PLATE_LAYOUT_WIDTH = 360;
const TEXT_PLATE_LAYOUT_HEIGHT = Math.round(
  TEXT_PLATE_LAYOUT_WIDTH *
    (CARD_TEXT_PLATE_LOCAL_SIZE.height / CARD_TEXT_PLATE_LOCAL_SIZE.width),
);

const RETREAT_PLATE_LAYOUT_WIDTH = 112;
const RETREAT_PLATE_LAYOUT_HEIGHT = Math.round(
  RETREAT_PLATE_LAYOUT_WIDTH *
    (CARD_RETREAT_PLATE_LOCAL_SIZE.height / CARD_RETREAT_PLATE_LOCAL_SIZE.width),
);

function plateTransformStyle(
  anchor: AbilityFocusAnchor | null | undefined,
  width: number,
  height: number,
): CSSProperties | null {
  const poly = anchor?.polygon;
  if (!poly || poly.length < 4) {
    return null;
  }
  const [bl, br, tr, tl] = poly;
  const matrix = cssMatrix3dForQuad(width, height, bl, br, tr, tl);
  if (!matrix) {
    return null;
  }
  return {
    width,
    height,
    transform: matrix,
    transformOrigin: '0 0',
  };
}

export function Board3dCardInfoOverlay({
  card,
  cardList,
  players,
  facedown = false,
  options = {},
  boardInteraction,
  onClose,
  onTableAction,
}: Board3dCardInfoOverlayProps) {
  const [textAnchor, setTextAnchor] = useState<AbilityFocusAnchor | null>(null);
  const [retreatAnchor, setRetreatAnchor] = useState<AbilityFocusAnchor | null>(null);

  useEffect(() => {
    const sub = boardInteraction.cardInspectFocus$.subscribe((state) => {
      setTextAnchor(state?.anchor ?? null);
      setRetreatAnchor(state?.retreatAnchor ?? null);
    });
    return () => sub.unsubscribe();
  }, [boardInteraction]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const textPlateStyle = useMemo(
    () => plateTransformStyle(textAnchor, TEXT_PLATE_LAYOUT_WIDTH, TEXT_PLATE_LAYOUT_HEIGHT),
    [textAnchor],
  );
  const retreatPlateStyle = useMemo(
    () =>
      plateTransformStyle(retreatAnchor, RETREAT_PLATE_LAYOUT_WIDTH, RETREAT_PLATE_LAYOUT_HEIGHT),
    [retreatAnchor],
  );
  const formattedText = (text: string) => formatCardText(text, CARD_INFO_ENERGY_ICON_SIZE);

  const displayPowers = useMemo(() => getDisplayPowers(card, cardList, players), [card, cardList, players]);
  const displayAttacks = useMemo(() => getDisplayAttacks(card, cardList, players), [card, cardList, players]);
  const transformCopy = useMemo(
    () => getInPlayTransformCopy(card, cardList, players),
    [card, cardList, players],
  );
  const ruleText = useMemo(() => getCardRuleText(card), [card]);

  const abilityUsedThisTurn =
    cardList instanceof PokemonCardList &&
    cardList.boardEffect.includes(BoardEffect.ABILITY_USED);

  const enabledAbilities = useMemo(() => {
    const m: Record<string, boolean> = {};
    const e = options.enableAbility;
    if (!e) return m;
    for (const power of displayPowers) {
      let ok =
        !!(e.useWhenInPlay && power.useWhenInPlay && !abilityUsedThisTurn) ||
        !!(e.useFromDiscard && power.useFromDiscard) ||
        !!(e.useFromHand && power.useFromHand);
      if (
        ok &&
        e.useFromHand &&
        power.useFromHand &&
        power.powerType === PowerType.LEGEND_ASSEMBLY &&
        card.tags?.includes(CardTag.DUAL_LEGEND)
      ) {
        ok = hasBothDualLegendHalvesInHand(cardList?.cards ?? [], card);
      }
      if (ok) m[power.name] = true;
    }
    return m;
  }, [abilityUsedThisTurn, card, cardList, displayPowers, options.enableAbility]);

  const viewingToolCard = isToolCardInList(card, cardList);
  const shouldEnableAttacks =
    !!options.enableAttack && !viewingToolCard && displayAttacks.length > 0;
  const shouldEnableRetreat = !!(card.superType === SuperType.POKEMON && options.enableRetreat);
  const showRetreatPlate = !facedown && card.superType === SuperType.POKEMON;
  const enableTrainerPlay = !!options.enableTrainer;
  const pokemon = card as PokemonCard;
  const displayPokemon = (transformCopy ?? pokemon) as PokemonCard;

  const hasTextContent =
    !facedown &&
    (displayPowers.length > 0 ||
      displayAttacks.length > 0 ||
      (card.superType !== SuperType.POKEMON && !!ruleText) ||
      enableTrainerPlay);

  return (
    <div className={styles.root} role="presentation">
      <div
        className={styles.dismiss}
        role="button"
        tabIndex={0}
        aria-label="Close card info"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
      />
      {textPlateStyle && hasTextContent ? (
        <div
          className={styles.plateStack}
          style={textPlateStyle}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
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
              <div className={styles.plate}>
                <div className={paneStyles.powerHeader}>
                  {powerTypeLabel(power.powerType) ? (
                    <div className={paneStyles.powerType}>
                      <span
                        className={
                          power.powerType === PowerType.POKEBODY
                            ? paneStyles.pokeBody
                            : paneStyles.ability
                        }
                      >
                        {powerTypeLabel(power.powerType)}
                      </span>
                    </div>
                  ) : null}
                  <div className={paneStyles.powerName}>{power.name}</div>
                </div>
                {power.text ? (
                  <div
                    className={paneStyles.cardText}
                    dangerouslySetInnerHTML={{ __html: formattedText(power.text) }}
                  />
                ) : null}
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
              <div className={styles.plate}>
                <div className={paneStyles.attackHeader}>
                  <div className={paneStyles.attackCost}>
                    {attack.cost.length === 0 ? (
                      <EnergyTypeIcon type={CardType.NONE} size="compact" />
                    ) : (
                      attack.cost.map((cost, i) => (
                        <EnergyTypeIcon
                          key={`${attack.name}-cost-${i}`}
                          type={cost}
                          size="compact"
                        />
                      ))
                    )}
                  </div>
                  <div className={paneStyles.attackName}>{attack.name}</div>
                  <div className={paneStyles.spacer} />
                  {attack.damage > 0 ? (
                    <div className={paneStyles.attackDamage}>
                      {attack.damage}
                      {attack.damageCalculation ? ` ${attack.damageCalculation}` : ''}
                    </div>
                  ) : null}
                </div>
                {attack.text ? (
                  <div
                    className={paneStyles.cardText}
                    dangerouslySetInnerHTML={{ __html: formattedText(attack.text) }}
                  />
                ) : null}
              </div>
            </HoverHighlight>
          ))}

          {ruleText && card.superType !== SuperType.POKEMON ? (
            <HoverHighlight
              enabled={enableTrainerPlay}
              onClick={
                onTableAction && enableTrainerPlay
                  ? () => onTableAction({ card, trainer: true })
                  : undefined
              }
            >
              <div className={styles.plate}>
                <div className={paneStyles.powerHeader}>
                  <div className={paneStyles.powerName}>{card.name}</div>
                </div>
                <div
                  className={paneStyles.cardText}
                  dangerouslySetInnerHTML={{ __html: formattedText(ruleText) }}
                />
              </div>
            </HoverHighlight>
          ) : null}
        </div>
      ) : null}

      {retreatPlateStyle && showRetreatPlate ? (
        <div
          className={styles.retreatPlate}
          style={retreatPlateStyle}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <HoverHighlight
            enabled={shouldEnableRetreat}
            className={styles.retreatInner}
            onClick={
              onTableAction && shouldEnableRetreat
                ? () => onTableAction({ card, retreat: true })
                : undefined
            }
          >
            <span className={styles.retreatLabel}>Retreat</span>
            <div className={styles.retreatRow}>
              {(displayPokemon.retreat ?? []).length === 0 ? (
                <EnergyTypeIcon type={CardType.NONE} size="compact" />
              ) : (
                (displayPokemon.retreat ?? []).map((cost, i) => (
                  <EnergyTypeIcon key={i} type={cost} size="compact" />
                ))
              )}
            </div>
          </HoverHighlight>
        </div>
      ) : null}
    </div>
  );
}
