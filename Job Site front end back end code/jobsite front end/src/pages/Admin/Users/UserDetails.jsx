import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import { adminService } from '../../../services/admin.service';

const UserDetails = () => {
   const { id } = useParams();
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const fetchUser = async () => {
      try {
         setLoading(true);
         const data = await adminService.getUserById(id);
         setUser(data);
      } catch (err) {
         console.error('Failed to load user', err);
         setError(err?.message || 'Failed to load user');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUser();
   }, [id]);

   const handleToggleStatus = async () => {
      if (!confirm(`${user.isActive ? 'Ban' : 'Unban'} this user?`)) return;
      
      try {
         if (user.isActive) await adminService.deactivateUser(id);
         else await adminService.activateUser(id);
         await fetchUser();
      } catch (err) {
         alert(`Failed to update status: ${err.message}`);
      }
   };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-12 text-neutral-500">Loading user…</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-12 text-red-600">{error}</div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-12 text-neutral-500">User not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">User Details</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-6">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-start">
               <div className="flex items-center">
                  <div className="h-16 w-16 bg-neutral-200 rounded-full flex items-center justify-center text-2xl font-bold text-neutral-500">
                     {(user.fullName || user.name || user.username)?.split(' ').map(n => n[0]).slice(0,2).join('')}
                  </div>
                  <div className="ml-4">
                     <h2 className="text-xl font-bold text-neutral-900">{user.fullName || user.name || user.username}</h2>
                     <p className="text-neutral-500">{user.email}</p>
                  </div>
               </div>
               <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                 {user.isActive ? 'Active' : 'Banned'}
               </span>
            </div>
           
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Account Info</h3>
                 <div className="space-y-3">
                     <div className="flex justify-between border-b border-neutral-50 pb-2">
                        <span className="text-neutral-600">Role</span>
                        <div className="flex items-center gap-2">
                           <span className="font-medium">{user.role}</span>
                           <Button size="small" variant="outline" className="text-xs py-0 h-6">Change</Button>
                        </div>
                     </div>
                     <div className="flex justify-between border-b border-neutral-50 pb-2">
                        <span className="text-neutral-600">Joined Date</span>
                        <span className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                     </div>
                     <div className="flex justify-between border-b border-neutral-50 pb-2">
                        <span className="text-neutral-600">User ID</span>
                        <span className="font-medium">{user.id}</span>
                     </div>
                 </div>
              </div>
              
              <div>
                 <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Activity Stats</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-lg text-center">
                       <div className="text-2xl font-bold text-primary-600">{user.stats?.applications ?? 0}</div>
                       <div className="text-xs text-neutral-500">Applications</div>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg text-center">
                       <div className="text-2xl font-bold text-green-600">{user.stats?.interviews ?? 0}</div>
                       <div className="text-xs text-neutral-500">Interviews</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

         {/* Danger Zone */}
         <div className="border border-red-200 rounded-xl overflow-hidden bg-red-50 p-6">
            <h3 className="text-lg font-bold text-red-700 mb-2">Administrative Actions</h3>
            <p className="text-red-600 text-sm mb-4">Manage user account status and security.</p>
            <div className="flex flex-wrap gap-4">
               <Button 
                  variant="outline" 
                  className={user.isActive ? "border-red-300 text-red-700 hover:bg-red-100" : "border-green-300 text-green-700 hover:bg-green-100"}
                  onClick={handleToggleStatus}
               >
                  {user.isActive ? 'Ban User' : 'Unban User'}
               </Button>
               <Button 
                 variant="outline" 
                 className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                 onClick={() => alert('Password reset link sent')}
               >
                  Reset Password
               </Button>
            </div>
         </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDetails;
