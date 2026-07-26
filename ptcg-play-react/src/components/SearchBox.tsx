import { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';
import styles from './SearchBox.module.css';

export type SearchBoxProps = {
  label?: string;
  showSearchButton?: boolean;
  activated?: boolean;
  className?: string;
  onSearch?: (value: string) => void;
};

export function SearchBox({
  label = 'Search...',
  showSearchButton = true,
  activated: activatedProp,
  className,
  onSearch,
}: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalActivated, setInternalActivated] = useState(!showSearchButton);
  const [value, setValue] = useState('');
  const isControlled = activatedProp !== undefined;
  const isActivated = isControlled ? activatedProp : internalActivated;

  useEffect(() => {
    if (isActivated) {
      inputRef.current?.focus();
    }
  }, [isActivated]);

  function emit(next: string) {
    onSearch?.(next);
  }

  function activate() {
    if (!isControlled) {
      setInternalActivated(true);
    }
  }

  function onBlur() {
    if (!isControlled && value === '') {
      setInternalActivated(false);
    }
  }

  function onChange(next: string) {
    setValue(next);
    emit(next);
  }

  function clear() {
    setValue('');
    emit('');
    if (!isControlled) {
      setInternalActivated(false);
    }
  }

  return (
    <div className={cn(styles.root, className)}>
      {showSearchButton && !isActivated ? (
        <button type="button" className={styles.activateBtn} onClick={activate}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          Search
        </button>
      ) : null}

      {(isActivated || !showSearchButton) && (
        <form
          className={styles.form}
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            value={value}
            placeholder={label}
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
          />
          {value ? (
            <button type="button" aria-label="Clear search" onClick={clear} style={{ display: 'none' }} />
          ) : null}
        </form>
      )}
    </div>
  );
}
