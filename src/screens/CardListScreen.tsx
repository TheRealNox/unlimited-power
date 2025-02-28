import Ionicons from '@expo/vector-icons/Ionicons';
import type BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CardList } from '@components/CardList';
import { CardListBottomSheet } from '@components/CardListBottomSheet';
import type { CardListScreenProps } from '@navigation/types';

export function CardListScreen({ navigation }: CardListScreenProps) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => {
        return (
          <Pressable
            onPress={() => {
              navigation.push('StackInfoScreen');
            }}
          >
            {({ pressed }) => (
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={tintColor}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        );
      },
    });
  }, [navigation]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const collapseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);

  const navigateToCardDetails = useCallback(
    (id: number, index: number, title: string, caption?: string) => {
      if (navigation) {
        collapseBottomSheet();
        navigation.push('StackCardDetailScreen', {
          id,
          index,
          title,
          caption,
        });
      }
    },
    [navigation, collapseBottomSheet],
  );

  return (
    <View style={styles.container}>
      <CardList
        onPressItem={navigateToCardDetails}
        collapseBottomSheet={collapseBottomSheet}
      />
      <CardListBottomSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
