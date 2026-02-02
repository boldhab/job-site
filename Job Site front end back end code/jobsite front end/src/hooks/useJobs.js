// Custom hook for job operations
import { useState, useEffect, useCallback } from 'react';
import { jobAPI } from '../api/job.api';

export const useJobs = (params = {}) => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (p = params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobAPI.getAll(p);
      const data = response.data;

      // Spring Page -> { content, totalElements, totalPages, number, size }
      setJobs(data.content || []);
      setPagination({
        page: data.number ?? 0,
        size: data.size ?? (p.size || 10),
        totalPages: data.totalPages ?? 0,
        totalElements: data.totalElements ?? 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, params]);

  return { jobs, pagination, loading, error, refetch: fetchJobs };
};
