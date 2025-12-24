/**
 * Security Alert Component
 * Shows one-time warning if device is jailbroken/rooted
 */

import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { securityService } from '../../../services/security/security-service';
import { LocaleProvider } from '../../../services/localisation';

export const SecurityAlert = () => {
  const hasShownAlert = useRef(false);

  useEffect(() => {
    if (__DEV__ || hasShownAlert.current) return;

    const checkSecurity = () => {
      const warning = securityService.getSecurityWarning();

      if (warning) {
        hasShownAlert.current = true;
        Alert.alert(
          LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.securityWarning,
          ),
          warning,
          [
            {
              text: LocaleProvider.formatMessage(
                LocaleProvider.IDs.message.iUnderstand,
              ),
              style: 'default',
            },
          ],
        );
      }
    };

    // Check after app is loaded (1 second delay)
    setTimeout(checkSecurity, 1000);
  }, []);

  return null;
};
