import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { jobService } from '../../../services/job.service';
import { cvService } from '../../../services/cv.service';
import { applicationService } from '../../../services/application.service';
import { toast } from 'react-hot-toast';
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  PaperClipIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [cvs, setCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCv, setNewCv] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [coverLetter, setCoverLetter] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobData, cvsData] = await Promise.all([
          jobService.getById(jobId),
          cvService.getMyCVs()
        ]);
        setJob(jobData);
        setCvs(cvsData);
        
        // Auto-select default CV
        const defaultCv = cvsData.find(cv => cv.isDefault);
        if (defaultCv) setSelectedCvId(defaultCv.id);
        else if (cvsData.length > 0) setSelectedCvId(cvsData[0].id);
      } catch (err) {
        toast.error('Failed to load application data');
        navigate('/job-seeker/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId, navigate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['.pdf', '.doc', '.docx'];
    const fileType = '.' + file.name.split('.').pop().toLowerCase();
    if (!validTypes.includes(fileType)) {
      toast.error('Please upload PDF, DOC, or DOCX files only');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setNewCv(file);
    setFileName(file.name);
    setSelectedCvId('');
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCvId && !newCv) {
      toast.error('Please select or upload a CV');
      return;
    }

    try {
      setSubmitting(true);
      
      let cvId = selectedCvId;
      
      // If new CV is selected, upload it first
      if (newCv) {
        const formData = new FormData();
        formData.append('file', newCv);
        const uploadedCv = await cvService.upload(formData);
        cvId = uploadedCv.id;
      }

      await applicationService.create({
        jobId: Number(jobId),
        cvId: cvId ? Number(cvId) : null,
        coverLetter: coverLetter
      });

      toast.success('Application submitted successfully!');
      navigate('/job-seeker/applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700 font-medium">Loading application form...</p>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      {/* Header Navigation */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-6 group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Job Details
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
            <DocumentArrowUpIcon className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>Apply for Position</h1>
            <p className="text-amber-800/70 mt-2">
              Complete your application for this exciting opportunity
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Job Summary Card */}
        <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-2 border-amber-200/50 rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-2">{job?.title}</h2>
              <div className="flex items-center text-amber-800">
                <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                <span className="font-medium">{job?.companyName || job?.employer?.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-amber-700/80">
              <span className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {job?.location || 'Remote'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <BriefcaseIcon className="w-4 h-4 mr-2" />
                {job?.type || 'Full-time'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* CV Selection Card */}
          <Card className="bg-gradient-to-br from-white via-amber-50/20 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
            <div className="border-b border-amber-200/50 px-6 py-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                  <DocumentTextIcon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900">Select Your Resume</h3>
                  <p className="text-amber-700/70 text-sm mt-1">Choose from existing resumes or upload a new one</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Existing CVs */}
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-amber-900 mb-4">Your Resumes</h4>
                {cvs.length === 0 ? (
                  <div className="text-center py-8 bg-gradient-to-br from-amber-50/30 to-amber-100/10 rounded-2xl border border-amber-200/30">
                    <DocumentTextIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <p className="text-amber-700/80 mb-4">No resumes found</p>
                    <p className="text-amber-600/70 text-sm">Upload your first resume below</p>
                  </div>
                ) : (
                  cvs.map(cv => (
                    <label 
                      key={cv.id} 
                      className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedCvId === cv.id
                          ? 'bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-300 shadow-lg'
                          : 'bg-gradient-to-br from-white to-amber-50/50 border border-amber-200/50 hover:border-amber-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center mr-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedCvId === cv.id
                            ? 'border-amber-500 bg-gradient-to-r from-amber-500 to-amber-600'
                            : 'border-amber-300 bg-white'
                        }`}>
                          {selectedCvId === cv.id && (
                            <CheckCircleIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-amber-900">{cv.fileName}</p>
                            <p className="text-sm text-amber-700/70 mt-1">
                              Uploaded on {new Date(cv.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                          {cv.isDefault && (
                            <span className="px-3 py-1 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-xs font-medium border border-amber-200/50">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <input 
                        type="radio" 
                        name="cvId" 
                        value={cv.id}
                        checked={selectedCvId === cv.id}
                        onChange={() => {
                          setSelectedCvId(cv.id);
                          setNewCv(null);
                          setFileName('');
                        }}
                        className="sr-only"
                      />
                    </label>
                  ))
                )}
              </div>

              {/* Upload New CV */}
              <div className="space-y-4">
                <h4 className="font-semibold text-amber-900">Upload New Resume</h4>
                <div className="space-y-6">
                  {/* File Upload Area */}
                  <label className={`block border-2 ${
                    newCv ? 'border-amber-300' : 'border-dashed border-amber-300'
                  } rounded-3xl p-8 text-center hover:border-amber-400 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-amber-50/30 to-amber-100/10`}>
                    {newCv ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
                            <DocumentTextIcon className="w-8 h-8 text-amber-600" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-amber-900 mb-2">{fileName}</p>
                          <div className="w-full bg-amber-100/50 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-amber-700/70 mt-2">
                            {uploadProgress < 100 ? 'Uploading...' : 'Upload complete!'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewCv(null);
                            setFileName('');
                            setUploadProgress(0);
                          }}
                          className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700"
                        >
                          <XMarkIcon className="w-4 h-4 mr-1" />
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div>
                        <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-amber-400 mb-4" />
                        <p className="text-amber-800 font-medium mb-2">Drag & drop your resume here</p>
                        <p className="text-amber-600/80 text-sm mb-4">or click to browse from your device</p>
                        <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium shadow-lg hover:shadow-2xl transition-all">
                          <PaperClipIcon className="w-5 h-5 mr-2" />
                          Browse Files
                        </div>
                        <p className="text-xs text-amber-600/70 mt-6">
                          Supported formats: PDF, DOC, DOCX • Max size: 5MB
                        </p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={!!newCv}
                    />
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Cover Letter Card */}
          <Card className="bg-gradient-to-br from-white via-amber-50/20 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
            <div className="border-b border-amber-200/50 px-6 py-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900">Cover Letter (Optional)</h3>
                  <p className="text-amber-700/70 text-sm mt-1">Tell the employer why you're a great fit</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <textarea 
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows="6"
                    className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 resize-none"
                    placeholder="Introduce yourself and explain why you're interested in this role. Highlight relevant experience and skills..."
                  ></textarea>
                  <div className="absolute bottom-4 right-4 text-xs text-amber-600/70">
                    {coverLetter.length}/2000
                  </div>
                </div>
                
                {/* Tips */}
                <div className="bg-gradient-to-br from-amber-50/30 to-amber-100/10 rounded-2xl p-4 border border-amber-200/50">
                  <p className="text-sm text-amber-700/80">
                    <span className="font-semibold text-amber-900">Tip:</span> Keep it concise (3-4 paragraphs), mention specific skills from the job description, and express enthusiasm for the company.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Application Checklist */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6">
            <h4 className="font-bold text-amber-900 mb-6 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2 text-amber-600" />
              Application Checklist
            </h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  selectedCvId || newCv
                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-emerald-600'
                    : 'border-amber-300 bg-white'
                }`}>
                  {selectedCvId || newCv ? (
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  )}
                </div>
                <span className={`font-medium ${
                  selectedCvId || newCv ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  Resume selected or uploaded
                </span>
              </div>
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  coverLetter.trim() !== ''
                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-emerald-600'
                    : 'border-amber-300 bg-white'
                }`}>
                  {coverLetter.trim() !== '' ? (
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  )}
                </div>
                <span className={`font-medium ${
                  coverLetter.trim() !== '' ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  Cover letter added (optional)
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
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
              loading={submitting}
              disabled={!selectedCvId && !newCv}
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-8 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Submitting Application...
                </div>
              ) : (
                <>
                  <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

// Helper icon components
const MapPinIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default ApplicationForm;