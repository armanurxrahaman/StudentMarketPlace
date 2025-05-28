// Cloudinary upload logic for unsigned uploads
// Replace with your own cloud name and upload preset
const CLOUD_NAME = 'difkdmijb'; // e.g. 'mycloudname'
const UPLOAD_PRESET = 'student_marketplace_unsigned'; // e.g. 'unsigned_preset'

const uploadImages = async (images) => {
  const uploadPromises = images.map(async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    // Optionally, you can add folder, tags, etc.
    // formData.append('folder', 'student-marketplace');
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }
  });
  return Promise.all(uploadPromises);
};

export default uploadImages;
