import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { adminService } from '../../../services/admin.service';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ role: 'ALL', search: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let data;
      if (filters.search && filters.search.includes('@')) {
        // Backend has a specific search by email endpoint
        data = await adminService.searchUsers(filters.search);
      } else if (filters.role !== 'ALL') {
        data = await adminService.getUsersByRole(filters.role);
      } else {
        data = await adminService.getAllUsers();
      }
      
      setUsers(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.role]); // Debounce search in a real app, but here we can just effect on role

  const handleAction = async (action, userId) => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      if (action === 'activate') await adminService.activateUser(userId);
      else if (action === 'deactivate') await adminService.deactivateUser(userId);
      else if (action === 'delete') await adminService.deleteUser(userId);
      else if (action === 'reset-password') alert('Password reset link sent to user'); // Mocking for now
      
      await fetchUsers();
    } catch (err) {
      alert(`Failed to ${action} user: ${err.message}`);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.search || 
      user.name?.toLowerCase().includes(filters.search.toLowerCase()) || 
      user.email?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
           <p className="text-neutral-600">Manage all registered users on the platform.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <select 
             value={filters.role} 
             onChange={(e) => setFilters({...filters, role: e.target.value})}
             className="px-3 py-2 border border-neutral-200 rounded-lg outline-none text-sm"
           >
             <option value="ALL">All Roles</option>
             <option value="JOB_SEEKER">Job Seekers</option>
             <option value="EMPLOYER">Employers</option>
             <option value="ADMIN">Admins</option>
           </select>
           <input 
             type="text" 
             placeholder="Search name or email..." 
             value={filters.search}
             onChange={(e) => setFilters({...filters, search: e.target.value})}
             className="px-3 py-2 border border-neutral-200 rounded-lg outline-none text-sm w-64"
           />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-neutral-500">Loading users…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : (
          <>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
             {filteredUsers.map(user => (
               <tr key={user.id} className="hover:bg-neutral-50 text-sm">
                 <td className="px-6 py-4">
                   <div className="font-medium text-neutral-900">{user.name || user.username}</div>
                   <div className="text-neutral-500">{user.email}</div>
                 </td>
                 <td className="px-6 py-4">
                   <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                     user.role === 'EMPLOYER' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                     user.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
                     'bg-blue-50 text-blue-700 border-blue-200'
                   }`}>
                     {user.role}
                   </span>
                 </td>
                 <td className="px-6 py-4">
                    <span className={`inline-block h-2 w-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-neutral-400'}`}></span>
                    {user.isActive ? 'Active' : 'Deactivated'}
                 </td>
                 <td className="px-6 py-4 text-neutral-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                 <td className="px-6 py-4 text-right font-medium">
                   <div className="flex justify-end gap-3">
                     <Link to={`/admin/users/${user.id}`} className="text-primary-600 hover:text-primary-900">Details</Link>
                     <button onClick={() => handleAction('reset-password', user.id)} className="text-neutral-600 hover:text-neutral-900">Reset</button>
                     {user.isActive ? (
                       <button onClick={() => handleAction('deactivate', user.id)} className="text-red-600 hover:text-red-900">Ban</button>
                     ) : (
                       <button onClick={() => handleAction('activate', user.id)} className="text-green-600 hover:text-green-900">Unban</button>
                     )}
                   </div>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
