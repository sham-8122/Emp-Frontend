import React from 'react';

const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex}>
              <div className={colIndex === 0 ? "skeleton skeleton-avatar" : "skeleton skeleton-text"} 
                   style={{ width: colIndex === 0 ? '40px' : '80%' }}>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;