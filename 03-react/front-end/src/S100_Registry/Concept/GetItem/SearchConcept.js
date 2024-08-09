import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { REGISTER_ITEM_LIST_URL } from '../api';

const SearchConcept = ({ onSearchResults }) => {
  const USER_SERIAL = sessionStorage.getItem('USER_SERIAL');
  const regi_uri = sessionStorage.getItem('REGISTRY_URI');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');

  // Initial fetch to load data without a search term
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(REGISTER_ITEM_LIST_URL, {
          params: {
            regi_uri: regi_uri,
          },
        });
        onSearchResults(response.data.register_items); // Pass results back to the parent component
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Handle search when the user clicks the search button
  const handleSearch = async () => {
    try {
        console.log('searchTerm:', searchTerm, 'status:', status, 'category:', category);
        const response = await axios.get(REGISTER_ITEM_LIST_URL, {
        params: {
          regi_uri: regi_uri,
          search_term: searchTerm,
          status,
          category,
        },
      });
      onSearchResults(response.data.register_items); // Pass results back to the parent component
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="processing">Processing</option>
          <option value="valid">Valid</option>
          <option value="superseded">Superseded</option>
          <option value="notValid">Not Valid</option>
          <option value="retired">Retired</option>
          <option value="clarified">Clarified</option>
        </select>
      </div>
      <div>
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Choose</option>
          <option value="name">Name</option>
          <option value="camelCase">Camel Case</option>
          <option value="definition">Definition</option>
        </select>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchConcept;
