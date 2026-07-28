import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import styles from './DropdownMenu.module.css';

export type DropdownMenuItem = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
};

export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export type DropdownMenuProps = {
  items: DropdownMenuItem[];
  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Fired after an item is chosen (in addition to item.onSelect). */
  onSelect?: (item: DropdownMenuItem) => void;
  /**
   * Optional trigger. Pass a string for the default styled button label,
   * a custom node, or omit to render a standalone panel when open.
   */
  trigger?: ReactNode;
  /** Accessible name when using the default trigger button. */
  'aria-label'?: string;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  placement?: DropdownMenuPlacement;
  /** Close the menu after selecting an item. Default true. */
  closeOnSelect?: boolean;
  /** Controlled highlighted index among `items`. */
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

function firstEnabledIndex(items: DropdownMenuItem[]): number {
  const idx = items.findIndex((item) => !item.disabled);
  return idx === -1 ? 0 : idx;
}

function lastEnabledIndex(items: DropdownMenuItem[]): number {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (!items[i]?.disabled) {
      return i;
    }
  }
  return 0;
}

function nextEnabledIndex(items: DropdownMenuItem[], from: number, delta: number): number {
  if (items.length === 0) {
    return 0;
  }
  let i = from;
  for (let n = 0; n < items.length; n += 1) {
    i = (i + delta + items.length) % items.length;
    if (!items[i]?.disabled) {
      return i;
    }
  }
  return from;
}

export function DropdownMenu({
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  trigger,
  'aria-label': ariaLabel,
  className,
  triggerClassName,
  panelClassName,
  placement = 'bottom-start',
  closeOnSelect = true,
  activeIndex: activeIndexProp,
  defaultActiveIndex,
  onActiveIndexChange,
}: DropdownMenuProps) {
  const isOpenControlled = openProp !== undefined;
  const isActiveControlled = activeIndexProp !== undefined;
  const [openUncontrolled, setOpenUncontrolled] = useState(defaultOpen);
  const [activeUncontrolled, setActiveUncontrolled] = useState(
    () => defaultActiveIndex ?? firstEnabledIndex(items),
  );

  const open = isOpenControlled ? openProp : openUncontrolled;
  const activeIndex = isActiveControlled ? activeIndexProp : activeUncontrolled;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = useId();
  const hasTrigger = trigger !== undefined;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setOpenUncontrolled(next);
      }
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const setActiveIndex = useCallback(
    (next: number) => {
      if (!isActiveControlled) {
        setActiveUncontrolled(next);
      }
      onActiveIndexChange?.(next);
    },
    [isActiveControlled, onActiveIndexChange],
  );

  const close = useCallback(() => {
    setOpen(false);
    if (hasTrigger) {
      triggerRef.current?.focus();
    }
  }, [hasTrigger, setOpen]);

  const selectItem = useCallback(
    (item: DropdownMenuItem) => {
      if (item.disabled) {
        return;
      }
      item.onSelect?.();
      onSelect?.(item);
      if (closeOnSelect) {
        close();
      }
    },
    [close, closeOnSelect, onSelect],
  );

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return;
    }
    if (wasOpenRef.current) {
      return;
    }
    wasOpenRef.current = true;
    const start = defaultActiveIndex ?? firstEnabledIndex(items);
    setActiveIndex(start);
    queueMicrotask(() => {
      itemRefs.current[start]?.focus({ preventScroll: true });
    });
  }, [open, defaultActiveIndex, items, setActiveIndex]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    }
    function onPointerDown(e: PointerEvent) {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close, setOpen]);

  const panelPlacementClass = useMemo(() => {
    if (!hasTrigger) {
      return styles.panelStandalone;
    }
    const parts = [styles.panelAnchored];
    if (placement.endsWith('end')) {
      parts.push(styles.panelAnchoredEnd);
    }
    if (placement.startsWith('top')) {
      parts.push(styles.panelAnchoredTop);
    }
    return cn(...parts);
  }, [hasTrigger, placement]);

  function moveActive(next: number) {
    setActiveIndex(next);
    queueMicrotask(() => {
      itemRefs.current[next]?.focus({ preventScroll: true });
    });
  }

  function onPanelKeyDown(e: ReactKeyboardEvent<HTMLUListElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(nextEnabledIndex(items, activeIndex, 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(nextEnabledIndex(items, activeIndex, -1));
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      moveActive(firstEnabledIndex(items));
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      moveActive(lastEnabledIndex(items));
    }
  }

  function renderDefaultTrigger(label: string) {
    return (
      <button
        ref={triggerRef}
        type="button"
        className={cn(styles.trigger, open && styles.triggerOpen, triggerClassName)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        aria-label={ariaLabel}
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpen(!open)}
      >
        {label}
      </button>
    );
  }

  function renderTrigger() {
    if (trigger === undefined) {
      return null;
    }
    if (typeof trigger === 'string') {
      return renderDefaultTrigger(trigger);
    }
    return (
      <button
        ref={triggerRef}
        type="button"
        className={cn(styles.trigger, open && styles.triggerOpen, triggerClassName)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        aria-label={ariaLabel}
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </button>
    );
  }

  return (
    <div className={cn(styles.root, className)} ref={rootRef}>
      {renderTrigger()}
      {open ? (
        <ul
          id={panelId}
          className={cn(styles.panel, panelPlacementClass, panelClassName)}
          role="menu"
          tabIndex={-1}
          aria-activedescendant={items[activeIndex] ? `${panelId}-item-${items[activeIndex].id}` : undefined}
          onKeyDown={onPanelKeyDown}
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex && !item.disabled;
            return (
              <li key={item.id} role="none">
                <button
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  id={`${panelId}-item-${item.id}`}
                  type="button"
                  role="menuitem"
                  className={cn(
                    styles.item,
                    isActive && styles.itemActive,
                    item.disabled && styles.itemDisabled,
                  )}
                  disabled={item.disabled}
                  tabIndex={isActive ? 0 : -1}
                  onMouseEnter={() => {
                    if (!item.disabled) {
                      setActiveIndex(index);
                    }
                  }}
                  onClick={() => selectItem(item)}
                >
                  <span className={styles.itemLabel}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
