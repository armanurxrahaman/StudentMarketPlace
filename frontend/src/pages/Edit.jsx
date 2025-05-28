import { useState } from 'react';
import toast from 'react-hot-toast';
import uploadImages from '../firebase/uploadImages'; // Adjust path as needed
import { FiEdit2, FiPackage, FiImage, FiBook, FiTag, FiCheckCircle, FiGrid } from 'react-icons/fi';
import { FaDollarSign } from 'react-icons/fa';
// Helper to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function EditItem() {
  const params = new URLSearchParams(location.search);
  const paramName = params.get('name');
  const [formData, setFormData] = useState({
    name: paramName,         // Identifier for the product to edit
    category: '',
    condition: '',
    grade: '',
    subject: '',
    price: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update form field values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection (multiple files)
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // Handle form submission for editing an item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images if any are selected.
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages(selectedFiles);
        console.log('Uploaded image URLs:', imageUrls);
      }

      // Get the logged in user's info from cookie and parse it.
      const rawUserInfo = getCookie("userInfo");
      let ownerId;
      if (!rawUserInfo) {
        console.error("No user info cookie found!");
      } else {
        try {
          const userInfo = JSON.parse(decodeURIComponent(rawUserInfo));
          ownerId = userInfo.userId;
          console.log("Owner ID:", ownerId);
        } catch (error) {
          console.error("Error parsing user info cookie:", error);
        }
      }
      const owner_id = Number(ownerId);

      // Prepare the payload. Only include new images if uploaded.
      const payload = {
        name: formData.name,               // Identifier used to locate the item
        category: formData.category,
        condition: formData.condition,
        grade: formData.grade,
        subject: formData.subject,
        price: Number(formData.price),
        owner_id,                         // From cookie
      };
      if (imageUrls.length > 0) {
        payload.images = imageUrls;
      }

      // Send the payload to the backend API for editing.
      const response = await fetch('http://localhost:3000/items/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        toast.error(data.error || 'Error editing item');
      } else {
        toast.success('Item updated successfully!');
        // Optionally, reset form fields
        setFormData({
          name: '',
          category: '',
          condition: '',
          grade: '',
          subject: '',
          price: '',
        });
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while editing the item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full opacity-20 blur-2xl"></div>
          </div>
          <div className="relative">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center mb-4">
              <FiEdit2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Item</h1>
            <p className="mt-2 text-gray-600">Update your item's information below</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiPackage className="w-4 h-4 mr-2 text-teal-600" />
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                className="w-full p-3 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Enter product name"
              />
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiTag className="w-4 h-4 mr-2 text-teal-600" />
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter category"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiCheckCircle className="w-4 h-4 mr-2 text-teal-600" />
                  Condition
                </label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full p-3 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter condition"
                />
              </div>
            </div>

            {/* Grade and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiGrid className="w-4 h-4 mr-2 text-teal-600" />
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full p-3 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter grade"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiBook className="w-4 h-4 mr-2 text-teal-600" />
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter subject"
                />
              </div>
            </div>

            {/* Price Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaDollarSign className="w-4 h-4 mr-2 text-teal-600" />
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Enter price"
              />
            </div>

            {/* Image Upload Section */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiImage className="w-4 h-4 mr-2 text-teal-600" />
                New Images (Optional)
              </label>
              <input
                id="images"
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
              >
                <FiImage className="w-4 h-4 mr-2" />
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} file(s) selected`
                  : 'Select New Images'}
              </label>

              {selectedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="h-32 w-full object-cover rounded-lg border border-gray-200 transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <FiEdit2 className="w-5 h-5 mr-2" />
                  Update Item
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditItem;
