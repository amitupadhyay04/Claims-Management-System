import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const MyPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [email, setEmail] = useState(""); // State for email
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPoliciesAndClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        if (!user) return;

        const userEmail = user.email;
        setEmail(userEmail);

        const policiesResponse = await axios.post(
          `${apiUrl}/api/policies/my-policies`,
          { email: userEmail },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // If response is empty, set policies to an empty array
        setPolicies(policiesResponse.data || []);
      } catch (err) {
        console.error("Error fetching policies:", err);
      }
    };

    fetchMyPoliciesAndClaims();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">My Policies</h2>
      {policies.length === 0 ? (
        <p>You have not enrolled in any policies.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy._id}>
                <td>{policy.name}</td>
                <td>{policy.category}</td>
                <td>Rs.{policy.premium}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/submit-claim/${policy._id}/${email}`)}
                  >
                    Submit Claim
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyPolicies;
