import { FlatList, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import { PRIORITY_LEVELS, PriorityLevel } from '../../../../../types';
import { AppIcon, AppText, Divider } from '../../../../components';
import { AppIconName, AppIconSize } from '../../../../components/icon/types';
import { Colors } from '../../../../../theme';
import {
  FormattedMessage,
  LocaleProvider,
} from '../../../../../services/localisation';

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
        style={styles.flagIconMargin}
      />

      <AppText style={styles.priorityItemText}>{value}</AppText>
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
          style={styles.priorityListContainer}
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
