import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ color: "var(--text-muted)" }}>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-sm btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-sm btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;