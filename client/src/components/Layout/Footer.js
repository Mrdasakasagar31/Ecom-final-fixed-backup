import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer' style={{ marginBottom: 0, paddingBottom: 0 }}>
      <h3 className='text-center'>All Right Reserved &copy; SAGAR KUMAR DAS</h3>
      <p className='text-center mt-3'>
        <Link className='down' to="/about"> About</Link> |
        <Link className='down' to="/contact"> Contact</Link> |
        <Link className='down' to="/policy"> Policy</Link>
      </p>
    </div>
  );
};

export default Footer;

