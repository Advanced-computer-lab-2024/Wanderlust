import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const ErrorPopupComponent = ({ errorMessage, show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{errorMessage}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ErrorPopupComponent.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ErrorPopupComponent;

//example usage

// import React, { useState } from 'react';
// import ErrorPopupComponent from './ErrorPopupComponent';

// const SomeComponent = () => {
//   const [showError, setShowError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleError = (message) => {
//     setErrorMessage(message);
//     setShowError(true);
//   };

//   const handleClose = () => {
//     setShowError(false);
//   };

//   return (
//     <div>
//       <button onClick={() => handleError('Something went wrong!')}>Trigger Error</button>
//       <ErrorPopupComponent errorMessage={errorMessage} show={showError} handleClose={handleClose} />
//     </div>
//   );
// };

// export default SomeComponent;