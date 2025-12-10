// Cloudinary Configuration
// Replace these values with your actual Cloudinary credentials

export const CLOUDINARY_CONFIG = {
  // Get these from your Cloudinary Dashboard
  CLOUD_NAME: 'dmtcn2gpt', // Replace with your cloud name
  UPLOAD_PRESET: 'blogapp', // Replace with your upload preset name
  
  // Widget configuration
  WIDGET_OPTIONS: {
    multiple: true,
    resourceType: 'image',
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    maxFiles: 10,
    maxFileSize: 10000000, // 10MB
    folder: 'products', // Optional: organize uploads in folders
    cropping: false, // Set to true if you want cropping functionality
    showAdvancedOptions: false,
    showSkipCropButton: true,
    croppingAspectRatio: 1, // Square aspect ratio
    theme: 'minimal', // or 'white', 'minimal'
  }
};

// Validation function
export const validateCloudinaryConfig = () => {
  if (CLOUDINARY_CONFIG.CLOUD_NAME === 'your-cloud-name') {
    console.warn('⚠️ Please update your Cloudinary cloud name in src/config/cloudinary.js');
    return false;
  }
  
  if (CLOUDINARY_CONFIG.UPLOAD_PRESET === 'your-upload-preset') {
    console.warn('⚠️ Please update your Cloudinary upload preset in src/config/cloudinary.js');
    return false;
  }
  
  return true;
};