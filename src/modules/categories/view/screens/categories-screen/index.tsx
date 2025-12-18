import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';
import { Conditional } from '../../../../../app/components/conditional';
import { CustomImage } from '../../../../../app/components/custom-image';
import { Images } from '../../../../../app/globals';
import { AppText } from '../../../../../app/components/text';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { CalendarPicker } from '../../../../../app/components/calendar-picker';

const todos = [];

export const CategoriesScreen = () => {
  const styles = useStyles();

  const RenderTodosList = <View>{/* Render the list of todos here */}</View>;

  const RenderEmptySection = (
    <View style={styles.notItemsSectionContainer}>
      <CustomImage
        uri={undefined}
        imageStyles={styles.emptyListImage}
        placeHolder={Images.HomeGraphics}
        resizeMode="cover"
      />
      <AppText style={styles.emptyListLabelHeading}>
        <FormattedMessage
          id={LocaleProvider.IDs.label.whatDoYouWantToDoToday}
        />
      </AppText>
      <AppText style={styles.emptyListLabelDescription}>
        <FormattedMessage id={LocaleProvider.IDs.label.tapToAddYourTasks} />
      </AppText>
    </View>
  );

  return (
    <Container
      insetsToHandle={['left', 'right']}
      screenBackgroundStyle={{ flex: 1 }}
      containerStyles={{ flex: 1 }}
    >
      {/* <HomeHeader
        title={LocaleProvider.formatMessage(LocaleProvider.IDs.label.index)}
      /> */}
      <View style={styles.container}>
        <Conditional
          ifTrue={todos?.length > 0}
          elseChildren={RenderEmptySection}
        >
          {RenderTodosList}
        </Conditional>
      </View>
    </Container>
  );
};
