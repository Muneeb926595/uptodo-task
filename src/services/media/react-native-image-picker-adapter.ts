import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { Image as CompressImage } from 'react-native-compressor';
import { MediaAdapter } from './media-adapter';

/**
 * React Native Image Picker Adapter
 * 
 * Implementation using react-native-image-picker and react-native-compressor.
 */
export class ReactNativeImagePickerAdapter implements MediaAdapter {
  async pickImage(
    options: ImageLibraryOptions = { mediaType: 'photo', quality: 0.8 },
  ): Promise<Asset | null> {
    const res = await launchImageLibrary(options);
    if (res?.didCancel) return null;
    return res?.assets?.[0] ?? null;
  }

  async compressImage(
    uri: string,
    opts: any = { compressionMethod: 'auto' },
  ): Promise<string> {
    return await CompressImage.compress(uri, opts);
  }

  async persistImage(tempUri: string, destPath: string): Promise<string> {
    await RNFS.copyFile(tempUri?.replace?.('file://', ''), destPath);
    return `file://${destPath}`;
  }
}
