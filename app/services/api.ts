import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard Data
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getRecentUsers = async (query?: string) => {
  const response = await api.get('/users/recent', { params: { query } });
  return response.data;
};

export const getPendingApprovals = async () => {
  const response = await api.get('/approvals/pending');
  return response.data;
};

// Wallet Management
export const getWallets = async (query?: string) => {
  const response = await api.get('/wallets', { params: { query } });
  return response.data;
};

export const createWallet = async (data: {
  name: string;
  type: 'custodial' | 'mpc';
  userId?: string;
}) => {
  const response = await api.post('/wallets', data);
  return response.data;
};

export const getWalletTransactions = async (
  walletId: string,
  params: {
    type?: 'all' | 'deposits' | 'withdrawals' | 'transfers';
    page?: number;
    limit?: number;
  }
) => {
  const response = await api.get(`/wallets/${walletId}/transactions`, { params });
  return response.data;
};

// User Management
export const getUsers = async (params: {
  query?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const updateUser = async (userId: string, data: {
  name?: string;
  email?: string;
  status?: 'active' | 'inactive';
}) => {
  const response = await api.patch(`/users/${userId}`, data);
  return response.data;
};

// Approval Management
export const handleApproval = async (
  approvalId: string,
  action: 'approve' | 'deny',
  reason?: string
) => {
  const response = await api.post(`/approvals/${approvalId}/${action}`, { reason });
  return response.data;
};

// Asset Management
export const getAssetTrend = async (params: {
  timeframe: 'day' | 'week' | 'month' | 'year';
  walletId?: string;
}) => {
  const response = await api.get('/assets/trend', { params });
  return response.data;
};

export default api; 