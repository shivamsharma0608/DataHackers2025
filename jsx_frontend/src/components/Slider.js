import React, {useState} from 'react';

export const Slider = ({selectedYear}) => {
    return (
        <div>
        <label>
            Estimated Year: <text>{selectedYear}</text>
        </label>
        <input
            type="range"
            min={0}
            max={5}
            //value={yearOffset}
            //onChange={(e) => setYearOffset(Number(e.target.value))}
            style={{ width: "100%"}}
        />
        </div>
  );
}