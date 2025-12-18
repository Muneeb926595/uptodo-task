import { FlatList, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useStyles } from './styles';
import { AppText } from '../../../../../app/components/text';
import { Divider } from '../../../../../app/components/divider';
import { PRIORITY_LEVELS, PriorityLevel } from '../../../types';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { Layout } from '../../../../../app/globals';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';

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
  const styles = useStyles();

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

export const TaskPriorityPicker = ({ onCancel, onConfirm }: Props) => {
  const styles = useStyles();

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
          style={{ marginTop: Layout.heightPercentageToDP(3) }}
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
