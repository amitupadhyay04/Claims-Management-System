import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const apiUrl = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/api/claims`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClaims(response.data);
      } catch (err) {
        setError("Failed to fetch claims.");
      }
    };
    fetchClaims();
  }, []);

  const sendEmailNotification = async (email, status) => {
    try {
      await axios.post(`${apiUrl}/api/mail/send-email`, {
        to: email,
        status
      });
    } catch (err) {
      console.error("Failed to send email notification:", err);
    }
  };

  const handleAction = async (claimId, status, email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}/api/claims/${claimId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim._id === claimId ? { ...claim, status } : claim
        )
      );

      await sendEmailNotification(email, status);
    } catch (err) {
      setError("Failed to update claim status.");
    }
  };

  const handleShowModal = (claim) => {
    setSelectedClaim(claim);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClaim(null);
  };

  const shortenUrl = (url) => {
    return url.length > 5 ? `${url.slice(0, 5)}...` : url;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Admin Dashboard</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Policy Name</th>
            <th>Policyholder Eamil</th>
            <th>Document</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Reason</th>
            <th>Analyzed Data</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim._id}>
              <td>{claim.policyId ? claim.policyId.name : "Unknown Policy"}</td>
              <td>{claim.policyholderEmail}</td>
              <td>
                <a href={claim.documentUrl} target="_blank" rel="noopener noreferrer">
                  {shortenUrl(claim.documentUrl)}
                </a>
              </td>
              <td>Rs.{claim.amount}</td>
              <td>{claim.status}</td>
              <td>
                {claim.status === "Pending" && (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleAction(claim._id, "Approved", claim.policyholderEmail)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleAction(claim._id, "Rejected", claim.policyholderEmail)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
              <td>{claim.description}</td>
              <td>
                <Button variant="info" onClick={() => handleShowModal(claim)}>
                  View Analyzed Data
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Analyzed Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClaim?.scannedData ? (
            <div>
              {Object.keys(selectedClaim.scannedData).map((key) => (
                <div key={key}>
                  <strong>{key}:</strong>
                  <ul>
                    {selectedClaim.scannedData[key].map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <span>No Analyzed data available</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
