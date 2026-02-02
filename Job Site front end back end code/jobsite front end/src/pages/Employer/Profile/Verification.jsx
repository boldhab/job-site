import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import { 
  CheckCircleIcon, 
  DocumentArrowUpIcon, 
  DocumentTextIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Verification = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Business License', status: 'Verified', date: '2025-01-15', type: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'Tax Identification', status: 'Verified', date: '2025-01-10', type: 'PDF', size: '1.8 MB' },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setDocuments(prevDocs => [
              ...prevDocs, 
              { 
                id: Date.now(), 
                name: 'Business Registration', 
                status: 'Pending', 
                date: new Date().toISOString().split('T')[0],
                type: 'PDF',
                size: '3.2 MB'
              }
            ]);
            setIsUploading(false);
            setUploadProgress(0);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
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
            <ShieldCheckIcon className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>Company Verification</h1>
            <p className="text-amber-800/70 mt-2">Verify your business to post jobs and build trust</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-emerald-50/80 to-emerald-100/40 border-2 border-emerald-200/50 rounded-3xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-emerald-600/5 flex items-center justify-center">
                  <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">Verification Status: Verified</h3>
                  <p className="text-emerald-700/80 mt-2">Your company has been fully verified. You have access to all premium features.</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-lg">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Verified
                </span>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="mt-8">
              <div className="flex justify-between text-sm font-medium text-emerald-700 mb-2">
                <span>Verification Progress</span>
                <span>100% Complete</span>
              </div>
              <div className="w-full bg-emerald-100/50 rounded-full h-3">
                <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          {/* Upload Card */}
          <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 p-6 md:p-8 rounded-3xl border-2 border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                <DocumentArrowUpIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className={`text-xl font-bold ${titleGradient}`}>Upload Documents</h2>
            </div>
            
            <p className="text-amber-800/80 mb-8 leading-relaxed">
              Upload your business registration documents for verification. Accepted formats: PDF, JPG, PNG, DOCX (Max 10MB each).
            </p>
            
            <form onSubmit={handleUpload} className="relative">
              <label 
                htmlFor="document-upload"
                className="block border-2 border-dashed border-amber-300 hover:border-amber-400 bg-gradient-to-br from-amber-50/30 to-amber-100/10 rounded-3xl p-8 md:p-12 text-center hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="text-amber-400 mb-6">
                  <DocumentArrowUpIcon className="mx-auto h-16 w-16" />
                </div>
                <p className="text-amber-800 font-medium mb-3">Drag & drop files here</p>
                <p className="text-amber-600/80 text-sm mb-6">or click to browse from your device</p>
                
                {isUploading ? (
                  <div className="max-w-md mx-auto">
                    <div className="w-full bg-amber-100/50 rounded-full h-2.5 mb-4">
                      <div 
                        className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-amber-700 text-sm">Uploading... {uploadProgress}%</p>
                  </div>
                ) : (
                  <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-lg hover:shadow-2xl transition-all">
                    <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                    Select Files
                  </div>
                )}
              </label>
              <input 
                id="document-upload"
                type="file" 
                className="hidden" 
                onChange={handleUpload}
                disabled={isUploading}
              />
            </form>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50">
                <DocumentTextIcon className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-amber-800">PDF, JPG, PNG</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50">
                <BuildingLibraryIcon className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-amber-800">Business Docs</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50">
                <ShieldCheckIcon className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-amber-800">Secure Upload</p>
              </div>
            </div>
          </div>

          {/* Uploaded Documents Card */}
          <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 p-6 md:p-8 rounded-3xl border-2 border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                  <DocumentTextIcon className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className={`text-xl font-bold ${titleGradient}`}>Uploaded Documents</h2>
              </div>
              <span className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-400/10 to-emerald-600/5 text-emerald-700 font-medium border border-emerald-200/50">
                {documents.length} Files
              </span>
            </div>
            
            <div className="space-y-4">
              {documents.map(doc => (
                <div 
                  key={doc.id} 
                  className="bg-gradient-to-br from-white to-amber-50/50 p-4 md:p-6 rounded-2xl border border-amber-200/50 hover:border-amber-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/5 to-amber-600/5 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-amber-900">{doc.name}</h4>
                          <span className={`px-3 py-1 rounded-2xl text-xs font-bold ${
                            doc.status === 'Verified' 
                              ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200/50'
                              : 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50'
                          }`}>
                            {doc.status === 'Verified' ? (
                              <span className="flex items-center">
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                Pending
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-amber-700/70">
                          <span className="flex items-center">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {doc.date}
                          </span>
                          <span>•</span>
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="small"
                        className="rounded-2xl border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-4 py-2 transition-all"
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="small"
                        className="rounded-2xl border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-4 py-2 transition-all"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Benefits Card */}
          <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 p-6 md:p-8 rounded-3xl border-2 border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                <CheckCircleIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className={`text-xl font-bold ${titleGradient}`}>Why Verify?</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/30 to-emerald-100/10 border border-emerald-200/50">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-emerald-600/5 flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 mb-1">Verified Badge</h4>
                  <p className="text-emerald-700/80 text-sm">Build trust with a verified badge on your profile</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50/30 to-amber-100/10 border border-amber-200/50">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center flex-shrink-0">
                  <MagnifyingGlassIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Higher Visibility</h4>
                  <p className="text-amber-700/80 text-sm">Priority placement in search results</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50/30 to-amber-100/10 border border-amber-200/50">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center flex-shrink-0">
                  <BuildingLibraryIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Unlimited Posts</h4>
                  <p className="text-amber-700/80 text-sm">Post unlimited jobs with verified status</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50/30 to-amber-100/10 border border-amber-200/50">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center flex-shrink-0">
                  <UsersIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Candidate Trust</h4>
                  <p className="text-amber-700/80 text-sm">Increase applications from qualified candidates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Card */}
          <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-2 border-amber-200/50 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-amber-900 mb-6">Verification Process</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold mr-4">
                  1
                </div>
                <span className="text-amber-800 font-medium">Upload Documents</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <span className="text-amber-800 font-medium">Manual Review</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <span className="text-amber-800 font-medium">Get Verified</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-amber-200/50">
              <p className="text-sm text-amber-700/70">Verification typically takes 24-48 hours</p>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❓</span>
            </div>
            <h4 className="font-bold text-amber-900 mb-2">Need Help?</h4>
            <p className="text-amber-700/80 text-sm mb-6">Contact our support team for verification assistance</p>
            <Button 
              variant="outline"
              className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg w-full py-3 transition-all"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Verification;