import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../views/components/text';
import { AppIcon } from '../../../../views/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../views/components/icon/types';
import { useTheme } from '../../../../theme';
import { magicModal } from 'react-native-magic-modal';
import { LocaleProvider } from '../../../../services/localisation';
import { styles } from './styles';

export enum TodoSortOption {
  DEFAULT = 'default',
  PRIORITY_HIGH_LOW = 'priority_high_low',
  PRIORITY_LOW_HIGH = 'priority_low_high',
  DATE_NEWEST = 'date_newest',
  DATE_OLDEST = 'date_oldest',
  TITLE_A_Z = 'title_a_z',
  TITLE_Z_A = 'title_z_a',
}

type SortOption = {
  id: TodoSortOption;
  labelKey: string;
  icon: AppIconName;
};

const sortOptions: SortOption[] = [
  {
    id: TodoSortOption.DEFAULT,
    labelKey: 'sortDefault',
    icon: AppIconName.calendar,
  },
  {
    id: TodoSortOption.PRIORITY_HIGH_LOW,
    labelKey: 'sortPriorityHighToLow',
    icon: AppIconName.flag,
  },
  {
    id: TodoSortOption.PRIORITY_LOW_HIGH,
    labelKey: 'sortPriorityLowToHigh',
    icon: AppIconName.flag,
  },
  {
    id: TodoSortOption.DATE_NEWEST,
    labelKey: 'sortDateNewest',
    icon: AppIconName.timer,
  },
  {
    id: TodoSortOption.DATE_OLDEST,
    labelKey: 'sortDateOldest',
    icon: AppIconName.timer,
  },
  {
    id: TodoSortOption.TITLE_A_Z,
    labelKey: 'sortTitleAZ',
    icon: AppIconName.edit,
  },
  {
    id: TodoSortOption.TITLE_Z_A,
    labelKey: 'sortTitleZA',
    icon: AppIconName.edit,
  },
];

type TodoSortModalProps = {
  currentSort: TodoSortOption;
  onSelectSort: (sort: TodoSortOption) => void;
};

export const TodoSortModal = ({
  currentSort,
  onSelectSort,
}: TodoSortModalProps) => {
  const { theme } = useTheme();

  const handleSelectSort = (sortOption: TodoSortOption) => {
    onSelectSort(sortOption);
    magicModal.hideAll();
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>
          {LocaleProvider.formatMessage(LocaleProvider.IDs.label.sortTasks)}
        </AppText>
        <TouchableOpacity onPress={() => magicModal.hideAll()}>
          <AppIcon
            name={AppIconName.cross}
            iconSize={AppIconSize.xlarge}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.optionsContainer}>
        {sortOptions.map(option => {
          const isSelected = currentSort === option.id;
          const labelKey =
            `message.${option.labelKey}` as keyof typeof LocaleProvider.IDs.label;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.transparent,
                },
              ]}
              onPress={() => handleSelectSort(option.id)}
            >
              <View style={styles.optionLeft}>
                {/* <AppIcon
                  name={option.icon}
                  iconSize={AppIconSize.medium}
                  color={theme.colors.white}
                /> */}
                <AppText
                  style={[
                    styles.optionText,
                    {
                      color: theme.colors.white,
                      fontWeight: isSelected ? '600' : '400',
                    },
                  ]}
                >
                  {LocaleProvider.formatMessage(labelKey)}
                </AppText>
              </View>
              {isSelected && (
                <AppIcon
                  name={AppIconName.send}
                  iconSize={AppIconSize.medium}
                  color={theme.colors.white}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
