import React, { useState, useEffect } from "react";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState([]);

  const artistList = [
    "Drake", "Dua Lipa", "Doja Cat", "David Guetta", "Demi Lovato",
    "Deftones", "Dean Lewis", "DaBaby"
  ];

  useEffect(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      setDropdown([]);
    } else {
      const filtered = artistList.filter((artist) =>
        artist.toLowerCase().startsWith(trimmedQuery)
      );
      setDropdown(filtered);
    }
  }, [query]);

  const handleDropdownClick = (artist) => {
    setQuery(artist);
    setDropdown([]);
  };

  const clearInput = () => {
    setQuery("");
    setDropdown([]);
  };

  return (
    <div style={{ position: "relative", width: "250px" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search an artist..."
          style={{
            width: "100%",
            padding: "8px 32px 8px 8px",
            boxSizing: "border-box",
            fontSize: "16px"
          }}
        />
        {query && (
          <button
            onClick={clearInput}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "red"
            }}
          >
            ✕
          </button>
        )}
      </div>

      {dropdown.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "gray",
            border: "1px solid #ccc",
            borderTop: "none",
            listStyle: "none",
            margin: 0,
            padding: 0,
            zIndex: 999
          }}
        >
          {dropdown.map((artist, index) => (
            <li
              key={index}
              onClick={() => handleDropdownClick(artist)}
              style={{
                padding: "5px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                fontSize: "15px"
              }}
            >
              {artist}
            </li>
          ))}
        </ul>
      )}

      {dropdown.length === 0 && query.trim() && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderTop: "none",
            padding: "8px",
            color: "#888",
            zIndex: 999
          }}
        >
          No results found
        </div>
      )}
    </div>
  );
};
