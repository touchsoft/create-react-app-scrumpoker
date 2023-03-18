import React from 'react';
import './CustomDialog.css';
import '../App.css';

const CustomDialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <h1>{title}</h1>
        </div>
        <div className="dialog-body">{children}</div>
        <p></p>
        <div className="dialog-footer">

          <button className="close-button" onClick={onClose}>
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
