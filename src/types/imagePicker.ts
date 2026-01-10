export type ImagePickerResponse = {
  didCancel?: boolean;
  errorCode?: string;
  errorMessage?: string;
  assets?: Array<{
    uri: string;
    width?: number;
    height?: number;
    type?: string;
    fileName?: string;
    fileSize?: number;
  }>;
};