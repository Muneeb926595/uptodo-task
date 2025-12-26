import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Button } from '../button';
import { AppText } from '../text';
import { LocaleProvider } from '../../../services/localisation';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>
        {LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.somethingWentWrong,
        )}
      </AppText>
      <AppText style={styles.errorMessage}>
        {error.message ??
          "Oops! We hit a little bump in the code. Refresh and we'll get back on track!"}
      </AppText>
      <Button
        buttonLable={LocaleProvider?.formatMessage?.(
          LocaleProvider?.IDs?.label?.tryAgain,
        )}
        onPress={resetError}
      />
    </View>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: ErrorFallbackProps) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback ?? ErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}
