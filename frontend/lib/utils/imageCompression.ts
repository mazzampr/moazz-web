import imageCompression, { Options } from 'browser-image-compression';

export async function compressImage(
  file: File, 
  customOptions?: Partial<Options>
): Promise<File> {

  const defaultOptions: Options = {
    maxSizeMB: 1,           
    maxWidthOrHeight: 1920,
    useWebWorker: true,     // Prevent UI freezing
    fileType: 'image/webp', // Convert to webp for better compression across the board (optional)
  };

  const options = { ...defaultOptions, ...customOptions };

  try {
    const compressedBlob = await imageCompression(file, options);
    
    // browser-image-compression returns a Blob, so we easily cast it back to a standard File
    return new File(
      [compressedBlob], 
      file.name.replace(/\.[^/.]+$/, "") + ".webp",
      { type: compressedBlob.type }
    );
  } catch (error) {
    console.error('Error during image compression, returning original file:', error);
    return file;
  }
}
