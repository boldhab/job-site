import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const CVBuilder = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', title: '', summary: '',
    experience: [], education: []
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">CV Builder</h1>
          <p className="text-neutral-600 mt-2">Create a professional resume in minutes.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
           <div className="flex items-center space-x-4">
             {[1, 2, 3].map(i => (
               <div key={i} className={`h-3 w-3 rounded-full ${step >= i ? 'bg-primary-600' : 'bg-neutral-300'}`}></div>
             ))}
           </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
          
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" placeholder="e.g. John" />
                <Input label="Last Name" placeholder="e.g. Doe" />
                <div className="md:col-span-2">
                  <Input label="Professional Title" placeholder="e.g. Senior Product Designer" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Professional Summary</label>
                  <textarea className="input w-full" rows={4} placeholder="Write a short summary about yourself..."></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Experience</h2>
                <button className="text-sm text-primary-600 font-medium">+ Add Position</button>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 mb-4">
                 <Input label="Job Title" placeholder="e.g. Frontend Developer" className="mb-4 bg-white" />
                 <Input label="Company" placeholder="e.g. Google" className="mb-4 bg-white" />
                 <div className="grid grid-cols-2 gap-4">
                   <Input label="Start Date" type="month" className="bg-white" />
                   <Input label="End Date" type="month" className="bg-white" />
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-3xl">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">All Set!</h2>
              <p className="text-neutral-600 mb-6">Your resume is ready to be generated.</p>
              <Button size="large">Download PDF</Button>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-100">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrev}>Previous</Button>
            )}
            <div className="ml-auto">
              {step < 3 && (
                <Button onClick={handleNext}>Next Step &rarr;</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CVBuilder;
