import React, { useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';

import { styles } from './styles';
import { TouchableWithoutFeedback, View } from 'react-native';

type BottomSheetProps = {
  children: any;
  refRBSheet: any;
  onClose?: () => void;
  height: number | string;
  isModal?: boolean;
};

export const BottomSheet = (props: BottomSheetProps) => {
  const { children, refRBSheet, onClose, height, isModal } = props;
  const renderBackdrop = useCallback(
    (props: any) => (
      <>
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        >
          {isModal && (
            <TouchableWithoutFeedback onPress={onDismiss}>
              <View style={{ flex: 1, backgroundColor: 'transparent' }} />
            </TouchableWithoutFeedback>
          )}
        </BottomSheetBackdrop>
      </>
    ),
    [],
  );

  const onDismiss = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <BottomSheetModal
      ref={refRBSheet}
      snapPoints={[height]}
      keyboardBlurBehavior="restore"
      enableDismissOnClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.container}
      onDismiss={onDismiss}
      accessible={true}
      handleStyle={{ display: 'none' }}
    >
      {children}
    </BottomSheetModal>
  );
};
