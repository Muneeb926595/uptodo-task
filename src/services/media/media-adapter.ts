import { Asset, ImageLibraryOptions } from 'react-native-image-picker';

/**
 * Media Adapter Interface
 * 
 * Abstract interface for media operations (image picking, compression, etc.).
 * Allows swapping react-native-image-picker, expo-image-picker, or web implementations.
 */
export interface MediaAdapter {
  /**
   * Pick an image from the user's gallery
   */
  pickImage(options?: ImageLibraryOptions): Promise<Asset | null>;

  /**
   * Compress an image given a URI
   */
  compressImage(uri: string, options?: any): Promise<string>;

  /**
   * Persist a temporary image to permanent storage
   */
  persistImage(tempUri: string, destPath: string): Promise<string>;
}
