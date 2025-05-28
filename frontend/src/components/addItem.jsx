import React, { useState } from 'react';
import toast from 'react-hot-toast';
import uploadImages from '../firebase/uploadImages';

// Helper to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function AddItem() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: '',
    grade: '',
    subject: '',
    price: '',
    available: true,
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name || !formData.category || !formData.condition || !formData.grade || !formData.subject || !formData.price) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image.');
      return;
    }

    setLoading(true);
    try {
      // Upload images to Firebase Storage and retrieve URLs.
      const imageUrls = await uploadImages(selectedFiles);
      if (!imageUrls || imageUrls.length === 0) {
        toast.error('Image upload failed. Please try again.');
        setLoading(false);
        return;
      }
      console.log('Uploaded image URLs:', imageUrls);

      // Get the logged in user's info from cookie and parse it.
      const rawUserInfo = getCookie("userInfo");
      let ownerId;

      if (!rawUserInfo) {
        toast.error('You must be logged in to add an item.');
        setLoading(false);
        return;
      } else {
        try {
          // Decode and parse the cookie value
          const userInfo = JSON.parse(decodeURIComponent(rawUserInfo));
          // Extract the owner id (assuming it's stored as userId)
          ownerId = userInfo.userId;
          if (!ownerId) {
            toast.error('User ID not found. Please log in again.');
            setLoading(false);
            return;
          }
          console.log("Owner ID:", ownerId);
        } catch (error) {
          toast.error('Error parsing user info. Please log in again.');
          setLoading(false);
          return;
        }
      }
      const owner_id = Number(ownerId);
      // Prepare the payload using proper data types.
      const payload = {
        name: formData.name,               // New product name field
        category: formData.category,
        condition: formData.condition,
        grade: formData.grade,
        subject: formData.subject,
        price: Number(formData.price),
        images: imageUrls,                 // Array of image URLs
        owner_id,                         // Taken from the user cookie
        available: formData.available,    // By default available is true
      };

      // Send the payload to the backend API.
      const response = await fetch('http://localhost:3000/items/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Backend error:', data);
        toast.error(data.error || 'Error adding item');
      } else {
        toast.success('Item added successfully!');
        // Optionally, reset form fields
        setFormData({
          name: '',
          category: '',
          condition: '',
          grade: '',
          subject: '',
          price: '',
          available: true,  // Reset available to true by default
        });
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'An error occurred while adding the item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10 border border-teal-100">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
        Add New Item
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
              className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter product name"
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
              className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter category"
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
              className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter condition"
          />
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter grade"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter subject"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
              className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter price"
          />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
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
            className="cursor-pointer inline-block px-6 py-3 rounded-lg text-white bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file(s) selected`
              : 'Select Images'}
          </label>
          {selectedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                    className="h-32 w-full object-cover rounded-lg border border-teal-100 group-hover:border-teal-500 transition-all duration-200"
                />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
            className={`w-full py-3 px-6 rounded-lg text-white bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
        </div>
      </form>
    </div>
  );
}

export default AddItem;
