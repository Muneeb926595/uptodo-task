import { Platform } from 'react-native';
import { Asset, ImageLibraryOptions } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { MediaAdapter } from './media-adapter';

export type PickedImage = {
  uri: string;
  name: string;
  type: string;
};

export type UploadFn = (
  file: PickedImage,
) => Promise<string> | Promise<{ url: string }>;

export type PickOptions = {
  pickerOptions?: ImageLibraryOptions;
  compressOptions?: any;
};

export type UploadOptions = PickOptions & {
  uploader?: UploadFn;
};

/**
 * Media Service
 * 
 * High-level service for handling media operations (pick, compress, upload).
 * Uses adapter pattern to support different image picker implementations.
 */
export class MediaService {
  constructor(private adapter: MediaAdapter) {}

  /**
   * Pick an image from the user's gallery
   */
  async pickImage(options?: ImageLibraryOptions): Promise<Asset | null> {
    return this.adapter.pickImage(options);
  }

  /**
   * Compress an image given a URI
   */
  async compressImage(uri: string, options?: any): Promise<string> {
    return this.adapter.compressImage(uri, options);
  }

  /**
   * Convert a local URI into a PickedImage object suitable for FormData or upload handlers
   */
  formatCompressedImageObject(uri: string): PickedImage {
    const uriChunks = uri?.split?.('/');
    const name = uriChunks?.[uriChunks?.length - 1];
    const ext = name?.split?.('.')?.pop?.() ?? 'jpg';
    const type = Platform.OS === 'android' ? `image/${ext}` : ext;
    return {
      uri,
      name,
      type,
    };
  }

  /**
   * Create FormData for uploading images using multipart/form-data
   */
  createImageFormData(file: PickedImage, fieldName = 'file'): FormData {
    const fd = new FormData();
    // @ts-ignore React Native FormData file object
    fd.append(fieldName, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
    return fd;
  }

  /**
   * Pick and compress an image
   */
  async pickAndCompress(options?: PickOptions): Promise<PickedImage | null> {
    const asset = await this.adapter.pickImage(options?.pickerOptions);
    if (!asset || !asset.uri) return null;

    const compressed = await this.adapter.compressImage(
      asset.uri,
      options?.compressOptions,
    );
    return this.formatCompressedImageObject(compressed);
  }

  /**
   * High level helper: pick -> compress -> upload
   * If uploader is provided it will be called with the PickedImage and
   * the returned value (string url or {url}) will be returned as uploadedUrl.
   */
  async pickCompressAndUpload(options: UploadOptions): Promise<{
    local?: PickedImage;
    uploadedUrl?: string;
  }> {
    const asset = await this.adapter.pickImage(options?.pickerOptions);
    if (!asset || !asset.uri) return {};

    const compressed = await this.adapter.compressImage(
      asset.uri,
      options?.compressOptions,
    );
    const picked = this.formatCompressedImageObject(compressed);

    if (!options?.uploader) return { local: picked };

    const resp = await options?.uploader?.(picked);
    const uploadedUrl =
      typeof resp === 'string' ? resp : resp && (resp as any)?.url;
    return { local: picked, uploadedUrl };
  }

  /**
   * Persist a temporary image to permanent storage
   */
  async persistImage(tempUri: string): Promise<string> {
    const fileName = tempUri?.split?.('/')?.pop?.();
    const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    return this.adapter.persistImage(tempUri, destPath);
  }
}
