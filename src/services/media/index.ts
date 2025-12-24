import { ReactNativeImagePickerAdapter } from './react-native-image-picker-adapter';
import { MediaService } from './media-service';

/**
 * Media Service Singleton
 * 
 * Centralized media operations instance using React Native Image Picker adapter.
 * Import this throughout the app for all media operations.
 */
export const mediaService = new MediaService(
  new ReactNativeImagePickerAdapter(),
);

// Re-export types
export type { PickedImage, UploadFn, PickOptions, UploadOptions } from './media-service';
export type { MediaAdapter } from './media-adapter';
