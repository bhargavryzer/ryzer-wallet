import type { DashboardStats, User, Approval, Wallet } from '@/types';

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch('/api/dashboard/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalWallets: 0,
      totalAssets: 0,
      frozenWallets: 0,
      pendingApprovals: 0,
      totalTransactions: 0,
      totalValue: 0
    };
  }
}

export async function getRecentUsers(searchQuery?: string): Promise<User[]> {
  try {
    const url = new URL('/api/dashboard/recent-users', window.location.origin);
    if (searchQuery) {
      url.searchParams.append('search', searchQuery);
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch recent users');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return [];
  }
}

export async function getPendingApprovals(): Promise<Approval[]> {
  try {
    const response = await fetch('/api/dashboard/pending-approvals');
    if (!response.ok) {
      throw new Error('Failed to fetch pending approvals');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return [];
  }
}

export async function getWallets(searchQuery?: string): Promise<Wallet[]> {
  try {
    const url = new URL('/api/wallets', window.location.origin);
    if (searchQuery) {
      url.searchParams.append('search', searchQuery);
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch wallets');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return [];
  }
}

export async function handleApproval(
  approvalId: string, 
  action: 'approve' | 'reject',
  reason?: string
): Promise<void> {
  try {
    const response = await fetch(`/api/approvals/${approvalId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, reason }),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${action} approval`);
    }
  } catch (error) {
    console.error(`Error ${action}ing approval:`, error);
    throw error;
  }
} 