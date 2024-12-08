import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const ErrorPopupComponent = ({ errorMessage, show, handleClose }) => {
  return (
    <Modal
      isOpen={show}
      onRequestClose={handleClose}
      contentLabel="Error"
      ariaHideApp={false}
      className="modal-dialog modal-sm bg-white p-4"  // Use modal-sm for small modal
      overlayClassName="modal-backdrop fade show"  // Backdrop should show correctly
      style={{
        overlay: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1050, // Ensure the overlay is above other content
        },
        content: {
          maxWidth: '400px', // Optional: Define a max width for the modal
          padding: '0',
          borderRadius: '10px',
        },
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="btn-close " onClick={handleClose}></button>
          <h5 className="modal-title text-danger">Error</h5>
        </div>
        <div className="modal-body">
          <p>{errorMessage}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary mt-2" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

ErrorPopupComponent.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ErrorPopupComponent;


