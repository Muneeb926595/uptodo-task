import { Platform } from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import { Image as CompressImage } from 'react-native-compressor';

export type PickedImage = {
  uri: string;
  name: string;
  type: string;
};

export type UploadFn = (
  file: PickedImage,
) => Promise<string> | Promise<{ url: string }>;

/**
 * Pick an image from the user's gallery and return the selected asset or null if cancelled.
 */
export const pickImage = async (
  options: ImageLibraryOptions = { mediaType: 'photo', quality: 0.8 },
): Promise<Asset | null> => {
  const res = await launchImageLibrary(options);
  if (res?.didCancel) return null;
  return res?.assets?.[0] ?? null;
};

/**
 * Compress an image given a uri using react-native-compressor.
 * Returns the compressed local uri string.
 */
export const compressImage = async (
  uri: string,
  opts: any = { compressionMethod: 'auto' },
): Promise<string> => {
  return await CompressImage.compress(uri, opts);
};

/**
 * Convert a local uri into a PickedImage object suitable for FormData or upload handlers.
 */
export const formateCompressedImageObject = (uri: string): PickedImage => {
  const uriChunks = uri?.split?.('/');
  const name = uriChunks?.[uriChunks?.length - 1];
  const ext = name?.split?.('.')?.pop?.() ?? 'jpg';
  const type = Platform.OS === 'android' ? `image/${ext}` : ext;
  return {
    uri,
    name,
    type,
  };
};

/**
 * Create FormData for uploading images using multipart/form-data
 */
export const createImageFormData = (
  file: PickedImage,
  fieldName = 'file',
): FormData => {
  const fd = new FormData();
  // @ts-ignore React Native FormData file object
  fd.append(fieldName, {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any);
  return fd;
};

/**
 * High level helper: pick -> compress -> (optional) upload.
 * If `uploader` is not provided, the function returns a local PickedImage.
 * If `uploader` is provided it will be called with the PickedImage and
 * the returned value (string url or {url}) will be returned as `uploadedUrl`.
 */
export const pickCompressAndOptionallyUpload = async (opts?: {
  pickerOptions?: ImageLibraryOptions;
  compressOptions?: any;
  uploader?: UploadFn;
}): Promise<{
  local?: PickedImage;
  uploadedUrl?: string;
}> => {
  const asset = await pickImage(opts?.pickerOptions);
  if (!asset || !asset.uri) return {};

  const compressed = await compressImage(asset.uri, opts?.compressOptions);
  const picked = formateCompressedImageObject(compressed);

  if (!opts?.uploader) return { local: picked };

  const resp = await opts?.uploader?.(picked);
  const uploadedUrl =
    typeof resp === 'string' ? resp : resp && (resp as any)?.url;
  return { local: picked, uploadedUrl };
};
