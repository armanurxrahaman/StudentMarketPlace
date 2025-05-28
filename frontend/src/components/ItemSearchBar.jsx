import React, { useState, useEffect } from "react";

const ItemSearchBar = () => {
  const [items, setItems] = useState([]); // all items from backend
  const [filteredItems, setFilteredItems] = useState([]); // items after filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    condition: "",
    grade: "",
    subject: "",
  });

  // Fetch all items once when the component mounts
  useEffect(() => {
    fetch("http://localhost:3000/items/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setItems(data.items);
          setFilteredItems(data.items);
        }
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Filter items based on the search query and filters
  const filterItems = (query, filters) => {
    let updatedItems = items;
    if (query) {
      updatedItems = updatedItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (filters.category) {
      updatedItems = updatedItems.filter((item) =>
        item.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    if (filters.condition) {
      updatedItems = updatedItems.filter((item) =>
        item.condition.toLowerCase().includes(filters.condition.toLowerCase())
      );
    }
    if (filters.grade) {
      updatedItems = updatedItems.filter((item) =>
        item.grade.toLowerCase().includes(filters.grade.toLowerCase())
      );
    }
    if (filters.subject) {
      updatedItems = updatedItems.filter((item) =>
        item.subject.toLowerCase().includes(filters.subject.toLowerCase())
      );
    }
    setFilteredItems(updatedItems);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterItems(query, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterItems(searchQuery, newFilters);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 border border-teal-100">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
        Search Items
      </h2>
      
      <div className="space-y-4">
      <input
        type="text"
        placeholder="Search items by name..."
        value={searchQuery}
        onChange={handleInputChange}
          className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
            className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
        />
        <input
          type="text"
          name="condition"
          placeholder="Condition"
          value={filters.condition}
          onChange={handleFilterChange}
            className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={filters.grade}
          onChange={handleFilterChange}
            className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={filters.subject}
          onChange={handleFilterChange}
            className="w-full p-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
        />
      </div>

        <div className="mt-6 space-y-4">
        {filteredItems.map((item) => (
            <div
            key={item.id}
              className="p-4 border border-teal-100 rounded-lg hover:border-teal-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
          >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="font-medium text-teal-600 mr-2">Category:</span>
                  {item.category}
                </p>
                <p className="flex items-center">
                  <span className="font-medium text-teal-600 mr-2">Condition:</span>
                  {item.condition}
                </p>
                <p className="flex items-center">
                  <span className="font-medium text-teal-600 mr-2">Grade:</span>
                  {item.grade}
                </p>
                <p className="flex items-center">
                  <span className="font-medium text-teal-600 mr-2">Subject:</span>
                  {item.subject}
                </p>
                <p className="flex items-center">
                  <span className="font-medium text-teal-600 mr-2">Price:</span>
                  ${item.price}
                </p>
              </div>
            </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default ItemSearchBar;
