import React from 'react';

const VendorEmptyState = ({ colSpan, message }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="vendor-empty-state">
        {message}
      </td>
    </tr>
  );
};

export default VendorEmptyState;
