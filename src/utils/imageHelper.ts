export const getImageSource = (img: any) => {
  if (!img) return null;
  if (typeof img === 'string' && img.startsWith('http')) {
    return { uri: img };
  }
  // React Native require() returns a number
  if (typeof img === 'number') {
    return img;
  }
  // Fallback for local files if they were somehow passed as strings
  if (typeof img === 'string') {
    return { uri: img };
  }
  return img;
};
