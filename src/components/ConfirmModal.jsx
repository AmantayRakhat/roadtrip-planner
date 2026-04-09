import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, message, confirmText, cancelText, onConfirm, onCancel, variant = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-body">
          <p className="confirm-message">{message}</p>
          <div className="confirm-actions">
            <button className={`btn-confirm-primary ${variant}`} onClick={onConfirm}>
              {confirmText}
            </button>
            <button className="btn-confirm-secondary" onClick={onCancel}>
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
