import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import { cvService } from '../../../services/cv.service';
import { toast } from 'react-hot-toast';

const CVManager = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingCv, setEditingCv] = useState(null);
  const [metadata, setMetadata] = useState({ title: '', description: '' });

  const fetchCvs = async () => {
    try {
      setLoading(true);
      const data = await cvService.getMyCVs();
      setCvs(data);
    } catch (err) {
      toast.error('Failed to load CVs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await cvService.upload(formData);
      toast.success('CV uploaded successfully!');
      fetchCvs();
    } catch (err) {
      toast.error('Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        await cvService.delete(id);
        toast.success('CV deleted successfully');
        fetchCvs();
      } catch (err) {
        toast.error('Failed to delete CV');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await cvService.setDefault(id);
      toast.success('Default CV updated');
      fetchCvs();
    } catch (err) {
      toast.error('Failed to set default CV');
    }
  };

  const handleEditMetadata = (cv) => {
    setEditingCv(cv);
    setMetadata({ title: cv.title || '', description: cv.description || '' });
  };

  const handleUpdateMetadata = async () => {
    try {
      await cvService.updateMetadata(editingCv.id, metadata);
      toast.success('Metadata updated successfully');
      setEditingCv(null);
      fetchCvs();
    } catch (err) {
      toast.error('Failed to update metadata');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
         <div>
           <h1 className="text-2xl font-bold text-neutral-900">CV / Resume Manager</h1>
           <p className="text-neutral-600">Upload and manage your resumes to apply faster.</p>
         </div>
         <div className="mt-4 md:mt-0 relative">
            <input 
              type="file" 
              id="cv-upload" 
              className="hidden" 
              onChange={handleUpload}
              accept=".pdf,.doc,.docx"
            />
            <Button onClick={() => document.getElementById('cv-upload').click()} loading={uploading}>
              <span className="mr-2">+</span> Upload New CV
            </Button>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">Loading CVs...</div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {cvs.map((cv) => (
              <li key={cv.id} className="p-6 flex flex-col sm:flex-row items-center justify-between hover:bg-neutral-50 transition-colors">
                <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs flex-shrink-0 uppercase">
                    {cv.fileType?.split('/')[1] || 'DOC'}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-neutral-900">{cv.title || cv.fileName}</h3>
                      {cv.isDefault && (
                        <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">
                      Uploaded on {new Date(cv.createdAt).toLocaleDateString()} &bull; {(cv.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {cv.description && <p className="text-xs text-neutral-400 mt-1 italic">{cv.description}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                  {!cv.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(cv.id)}
                      className="text-sm text-neutral-600 hover:text-primary-600 font-medium"
                    >
                      Set Default
                    </button>
                  )}
                  <button 
                    onClick={() => handleEditMetadata(cv)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(cv.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {!loading && cvs.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-neutral-500 mb-4">You haven't uploaded any resumes yet.</p>
            <Button onClick={() => document.getElementById('cv-upload').click()}>Upload Your First CV</Button>
          </div>
        )}
      </div>

      {/* Edit Metadata Modal */}
      {editingCv && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 bg-white animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Edit CV Details</h3>
            <div className="space-y-4">
              <Input 
                label="CV Title" 
                value={metadata.title} 
                onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                placeholder="e.g. Frontend Engineer Resume 2024"
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea 
                   className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                   rows="3"
                   value={metadata.description}
                   onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                   placeholder="Short note about this CV..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setEditingCv(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleUpdateMetadata}>Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CVManager;
