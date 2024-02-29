import * as Haptics from 'expo-haptics';
import debounce from 'lodash/debounce';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Chip } from '@components/Chip';
import { useTheme } from '@hooks/useTheme';

type ChipsProps<T> = {
  heading: string;
  options: { value: T; label: string }[];
  selections: T[];
  onChange: (options: T[]) => void;
  single?: boolean;
  delay?: number;
};

export function Chips<T>({
  heading,
  options,
  selections,
  onChange: handleChange,
  single = false,
  delay = 0,
}: ChipsProps<T>) {
  const { themeStyles } = useTheme();

  const selectedOptionsRef = useRef(selections);
  const [selectedOptions, setSelectedOptions] = useState(selections);

  const handleChangeDebounced = useMemo(
    () =>
      debounce(() => {
        handleChange(selectedOptionsRef.current);
      }, delay),
    [handleChange, delay],
  );

  const handlePressChip = useCallback(
    (option: T, isSelected: boolean) => {
      Haptics.selectionAsync();

      if (isSelected) {
        if (!single) {
          selectedOptionsRef.current = [...selectedOptionsRef.current].filter(
            (a) => {
              return a !== option;
            },
          );
        }
      } else {
        if (single) {
          selectedOptionsRef.current = [option];
        }

        selectedOptionsRef.current = [
          ...selectedOptionsRef.current,
          option,
        ].filter((a, i, self) => {
          return self.indexOf(a) === i;
        });
      }

      setSelectedOptions(selectedOptionsRef.current);

      handleChangeDebounced();
    },
    [single, handleChangeDebounced],
  );

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.headingText, themeStyles.themedColor]}>
          {heading}
        </Text>
      </View>
      <View style={styles.chipsContainer}>
        {options.map((option) => (
          <Chip
            label={option.label}
            value={option.value}
            isSelected={selectedOptions.includes(option.value)}
            onPress={handlePressChip}
            key={`chip-${option.value}`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  heading: {
    marginBottom: 8,
  },
  headingText: {
    fontSize: 20,
    fontWeight: '700',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
});
