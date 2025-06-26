import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";

function App() {
  const [media, setMedia] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [refreshType, setRefreshType] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'media_type', label: 'Media Type' },
    { key: 'year', label: 'Year' },
    { key: 'rating', label: 'Rating' }
  ];

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await axios.get('/api/media');
      setMedia(res.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleRefresh = (type) => {
    if (type === 'full') {
      setModalText('This will take some time and will fully refresh the local database.');
    } else {
      setModalText('This may take some time while we check the databases.');
    }
    setRefreshType(type);
    setShowModal(true);
  };

  const confirmRefresh = async () => {
    setShowModal(false);
    setShowSpinner(true);
    try {
      if (refreshType === 'full') {
        await axios.post('/api/refresh/full');
      } else {
        await axios.post('/api/refresh/partial');
      }
      await fetchMedia();
    } catch (err) {
      console.error('Refresh failed:', err);
    }
    setShowSpinner(false);
  };

  const filteredMedia = media
    .filter((item) => {
      if (typeFilter === 'all') return true;
      return item.media_type === typeFilter;
    })
    .filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title));

  const exportToText = () => {
    const lines = [];

    // Header
    lines.push(columns.map(col => col.label).join('\t'));

    // Rows
    filteredMedia.forEach(item => {
      const row = columns.map(col => item[col.key] ?? '').join('\t');
      lines.push(row);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `PlexList_Export_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

const exportToPDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(16);
  doc.text("PlexList Export", pageWidth / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  const colWidths = [100, 35, 25, 25]; // Adjust to your layout
  const headers = columns.map(col => col.label);
  const rows = filteredMedia.map(item => columns.map(col => item[col.key] ?? ''));

  // Draw headers
  let x = 10;
  headers.forEach((header, i) => {
    doc.text(header, x, y);
    x += colWidths[i];
  });
  y += 8;

  // Draw data rows
  rows.forEach(row => {
    x = 10;
    row.forEach((cell, i) => {
      doc.text(String(cell), x, y);
      x += colWidths[i];
    });
    y += 8;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`PlexList_Export_${new Date().toISOString().split('T')[0]}.pdf`);
};


  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4">PlexList</h1>
      <div className="flex items-center space-x-4 mb-4">
        <select value={typeFilter} onChange={handleTypeChange} className="border px-2 py-1 rounded">
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
          <option value="home_movie">Home Movies</option>
        </select>

        <input
          type="text"
          placeholder="Search title..."
          value={searchText}
          onChange={handleSearchChange}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={() => handleRefresh('full')}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Full Refresh
        </button>
        <button
          onClick={() => handleRefresh('partial')}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Partial Refresh
        </button>
        <button
          onClick={exportToPDF}
          className="bg-blue-500 text-white px-3 py-1 roundSed hover:bg-blue-600"
        >
          Export List
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {columns.map(col => (
              <th key={col.key} className="border px-2 py-1 text-left">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredMedia.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              {columns.map(col => (
                <td key={col.key} className="border px-2 py-1 capitalize">
                  {item[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {filteredMedia.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No media found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <p className="mb-4 text-gray-800">{modalText}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmRefresh}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {showSpinner && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-30">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg font-medium text-gray-700">Refreshing...</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
