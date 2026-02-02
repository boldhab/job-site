import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';

const NotFound = () => {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl font-bold text-primary-100">404</h1>
        <h2 className="text-3xl font-bold text-neutral-900 mt-4 mb-6">Page not found</h2>
        <p className="text-neutral-600 max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button variant="primary" size="large">
            Go Back Home
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
