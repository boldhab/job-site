import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../../services/job.service';
import { aiService } from '../../../services/ai.service';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { BriefcaseIcon, CurrencyDollarIcon, MapPinIcon, AcademicCapIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    salary: '',
    experience: 'Entry Level',
    description: '',
    requirements: '',
    deadline: '',
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleAISuggest = async () => {
    if (!form.title) {
        alert('Please enter a job title first so I can generate a description for it.');
        return;
    }
    setIsOptimizing(true);
    try {
        const res = await aiService.optimizeJob(form.title, 'Technology');
        setForm(prev => ({ ...prev, description: res.suggestion }));
    } catch (err) {
        console.error('AI suggestion failed', err);
        alert('AI service is busy, please try again.');
    } finally {
        setIsOptimizing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        location: form.location,
        type: form.type,
        salaryRange: form.salary,
        experienceLevel: form.experience,
        description: form.description,
        requirements: form.requirements,
        deadline: form.deadline ? `${form.deadline}T23:59:59` : null,
      };

      await jobService.create(payload);
      navigate('/employer/jobs');
    } catch (err) {
      console.error('Failed to post job', err);
      alert(err?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";
  const accentGradient = "bg-gradient-to-r from-amber-500 to-amber-600";

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
            <BriefcaseIcon className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>Post a New Job</h1>
            <p className="text-amber-800/70 mt-2">Find the best talent for your company</p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="mt-8">
          <div className="w-full bg-amber-100/50 rounded-full h-2.5">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: '60%' }}></div>
          </div>
          <div className="flex justify-between text-sm text-amber-700/80 mt-2">
            <span>Basic Details</span>
            <span>Requirements</span>
            <span>Review</span>
            <span className="font-semibold text-amber-800">Preview</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <Card className="bg-gradient-to-br from-white via-amber-50/20 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-amber-500/5 via-amber-400/10 to-amber-500/5 border-b border-amber-200/50 px-8 py-6">
            <h2 className="text-xl font-bold text-amber-900">Job Information</h2>
            <p className="text-amber-700/80 text-sm mt-1">Fill in the details to attract qualified candidates</p>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-3 flex items-center">
                  <BriefcaseIcon className="w-4 h-4 mr-2 text-amber-600" />
                  Job Title
                </label>
                <Input 
                  name="title" 
                  value={form.title} 
                  onChange={onChange} 
                  placeholder="e.g. Senior Frontend Engineer" 
                  required
                  className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                />
              </div>
              
              {/* Location & Job Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-3 flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2 text-amber-600" />
                    Location
                  </label>
                  <Input 
                    name="location" 
                    value={form.location} 
                    onChange={onChange} 
                    placeholder="e.g. Remote, New York, NY" 
                    required
                    className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-3">Job Type</label>
                  <div className="relative">
                    <select 
                      name="type" 
                      value={form.type} 
                      onChange={onChange} 
                      className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 appearance-none"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Freelance</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-semibold text-amber-900 mb-3 flex items-center">
                    <CalendarDaysIcon className="w-4 h-4 mr-2 text-amber-600" />
                    Application Deadline
                  </label>
                  <Input 
                    type="date"
                    name="deadline" 
                    value={form.deadline} 
                    onChange={onChange} 
                    className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-3 flex items-center">
                    <AcademicCapIcon className="w-4 h-4 mr-2 text-amber-600" />
                    Experience Level
                  </label>
                  <div className="relative">
                    <select 
                      name="experience" 
                      value={form.experience} 
                      onChange={onChange} 
                      className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 appearance-none"
                    >
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                      <option>Lead / Manager</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-3 flex items-center">
                  <CurrencyDollarIcon className="w-4 h-4 mr-2 text-amber-600" />
                  Salary Range (Optional)
                </label>
                <Input 
                  name="salary" 
                  value={form.salary} 
                  onChange={onChange} 
                  placeholder="e.g. $80,000 - $100,000" 
                  className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                />
              </div>

              {/* Job Description */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-amber-900">Job Description</label>
                  <button 
                    type="button"
                    onClick={handleAISuggest}
                    disabled={isOptimizing}
                    className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 hover:bg-amber-100 transition-all disabled:opacity-50"
                  >
                    <SparklesIcon className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                    {isOptimizing ? 'AI Generating...' : 'AI Suggest'}
                  </button>
                </div>
                <div className="relative">
                  <textarea 
                    rows="6" 
                    className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 resize-none"
                    placeholder="Describe the role, responsibilities, company culture, and what makes this position exciting..."
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    required
                  ></textarea>
                  <div className="absolute bottom-4 right-4 text-xs text-amber-600/70">
                    {form.description.length}/2000
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-3">Requirements</label>
                <div className="relative">
                  <textarea 
                    rows="4" 
                    className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 resize-none"
                    placeholder="List key requirements, skills, qualifications, and nice-to-haves..."
                    name="requirements"
                    value={form.requirements}
                    onChange={onChange}
                  ></textarea>
                  <div className="absolute bottom-4 right-4 text-xs text-amber-600/70">
                    {form.requirements.length}/1000
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-amber-200/50">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate(-1)}
                  className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-8 py-3 transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  loading={loading}
                  className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-8 py-3 transition-all"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Posting Job...
                    </div>
                  ) : (
                    <>
                      <BriefcaseIcon className="w-5 h-5 mr-2" />
                      Post Job
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
        </Card>

        {/* Tips Card */}
        <div className="mt-8 bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-2 border-amber-200/50 rounded-3xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">Tips for Better Results</h3>
              <ul className="space-y-2 text-amber-800/80">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0"></span>
                  Be specific about required skills and experience level
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0"></span>
                  Include salary range to attract more qualified candidates
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0"></span>
                  Mention company culture and growth opportunities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;