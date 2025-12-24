import { FlatList, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import { AppText } from '../../../../views/components/text';
import { Divider } from '../../../../views/components/divider';
import { PRIORITY_LEVELS, PriorityLevel } from '../../../../types';
import { AppIcon } from '../../../../views/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../views/components/icon/types';
import { Colors } from '../../../../theme';
import { Layout } from '../../../../globals';
import { FormattedMessage } from '../../../../services/localisation';
import { LocaleProvider } from '../../../../services/localisation';

type Props = {
  onCancel: () => void;
  onConfirm: (p: PriorityLevel) => void;
};

type PriorityItemProps = {
  value: PriorityLevel;
  selected: boolean;
  onPress: () => void;
};

const RenderPriorityItem = ({
  value,
  selected,
  onPress,
}: PriorityItemProps) => {

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.priorityItemContainer,
        selected && styles.priorityItemSelected,
      ]}
    >
      <AppIcon
        name={AppIconName.flag}
        iconSize={AppIconSize.primary}
        color={Colors.white}
        style={{ marginBottom: Layout.heightPercentageToDP(1) }}
      />

      <AppText style={[styles.priorityItemText]}>{value}</AppText>
    </TouchableOpacity>
  );
};

export const TodoPriorityPicker = ({ onCancel, onConfirm }: Props) => {

  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>(1);

  return (
    <View style={styles.backdrop}>
      <View style={styles.container}>
        <AppText style={styles.heading}>
          <FormattedMessage id={LocaleProvider.IDs.label.taskPriority} />
        </AppText>
        <Divider />

        <FlatList
          data={PRIORITY_LEVELS}
          numColumns={4}
          style={{ marginTop: Layout.heightPercentageToDP(2.4) }}
          keyExtractor={item => item?.toString?.()}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RenderPriorityItem
              value={item}
              selected={item === selectedPriority}
              onPress={() => setSelectedPriority(item)}
            />
          )}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <AppText style={styles.cancel}>
              <FormattedMessage id={LocaleProvider.IDs.general.cancel} />
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onConfirm(selectedPriority)}
            style={styles.chooseBtn}
          >
            <AppText style={styles.chooseText}>
              <FormattedMessage id={LocaleProvider.IDs.general.save} />
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
