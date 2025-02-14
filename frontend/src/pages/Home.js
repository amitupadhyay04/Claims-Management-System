import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer'; // Import Footer component

const Home = () => {
  return (
    <div>
      {/* Main Section */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-8">
            <br /><br /><br /><br />
            <h1 className="display-4">
              <strong>AI Claims Management System </strong> 
              <br />
              {/* Fast, Accurate, and Easy Claim Processing */}
            </h1>
            {/* <p className="lead">
              Create, manage, and track your claims in real-time from any device.
            </p> */}
            <p className="lead">
              <h2>Fast, Accurate, and Easy Claim Processing</h2>
            </p>
            <p className="lead">
              Experience the future of claims management with our AI-powered system that makes processing faster and easier than ever.
            </p>
            <br />
            <form action="/policies" method="get">
              <button
                type="submit"
                className="btn btn-primary"
              >
                View Policies
              </button>
            </form>

            <h4 className="mt-3">
              <button type="submit" className="btn btn-link">
                <a href="#how-it-works" style={{ color: '#515b9d' }}>
                  How Does it Work?
                </a>
              </button>
            </h4>

            <br />
            <p style={{ color: 'rgb(95, 95, 95)' }}>
              New to the system?{' '}
              <Link to="/register" className="text-primary">
                Register up for free
              </Link>
            </p>
          </div>

          <div className="col-md-4 d-flex justify-content-center mt-5 pt-5">
            <div className="w-100">
              <img
              src="CMS-Home-Page.png"
              className="img-fluid"
              style={{ width: '250%', height: '75%' }} 
              alt="Claims Management Visual"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="container">
        <div className="col">
          <br /><br />
          <hr />
        </div>
      </div>

      <section>
        <div className="container py-5 text-center">
          <span className="badge text-bg-light">
            <h4 className="text-dark">
              Efficient Claims Management
            </h4>
          </span>
          <h1 className="display-4">Streamline Your Claims Process</h1>
          <p className="lead text-muted">
            Manage all your claims effortlessly in a single platform.
          </p>
        </div>
      </section>

      {/* Video Display Section */}
      <section id="how-it-works" className="text-center my-5">
        <video width="1100" height="640" controls>
          <source src="How-it-Works-CMS.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
