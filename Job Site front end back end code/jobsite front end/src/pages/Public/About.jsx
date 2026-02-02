import React from 'react';
import MainLayout from '../../components/layout/MainLayout';

const About = () => {
  return (
    <MainLayout>
      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral-900 mb-8">About JobConnect</h1>
          
          <div className="prose prose-lg text-neutral-600">
            <p className="mb-6">
              JobConnect is the leading platform for connecting exceptional talent with world-class opportunities. 
              Founded in 2024, our mission is to make the job search process transparent, efficient, and human.
            </p>
            
            <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Our Mission</h2>
            <p className="mb-6">
              We believe that everyone deserves a career that they love. We're building the tools and community 
              to help people find their path and help companies build their dream teams.
            </p>
            
            <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">For Employers</h2>
            <p className="mb-6">
              We provide powerful tools to help you find, interview, and hire the best candidates. 
              Our AI-driven matching system ensures you see the most relevant applicants first.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">For Job Seekers</h2>
            <p>
              We know looking for a job can be stressful. We've designed our platform to be intuitive 
              and supportive, giving you the insights you need to land your next role.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
