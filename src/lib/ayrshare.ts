const AYRSHARE_API_KEY = import.meta.env.VITE_AYRSHARE_API_KEY;
const AYRSHARE_DOMAIN = import.meta.env.VITE_AYRSHARE_DOMAIN;

if (!AYRSHARE_API_KEY || !AYRSHARE_DOMAIN) {
  throw new Error('Missing Ayrshare environment variables');
}

const AYRSHARE_API_BASE = 'https://app.ayrshare.com/api';

export interface AyrsharePostRequest {
  post: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduleDate?: string;
  profileKey?: string;
}

export interface AyrsharePostResponse {
  status: 'success' | 'error';
  id?: string;
  postIds?: Record<string, string>;
  errors?: Array<{ platform: string; message: string }>;
}

export interface AyrshareProfile {
  id: string;
  title: string;
  platforms: string[];
}

export const ayrshareApi = {
  async createPost(data: AyrsharePostRequest): Promise<AyrsharePostResponse> {
    const response = await fetch(`${AYRSHARE_API_BASE}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Ayrshare API error: ${response.statusText}`);
    }

    return response.json();
  },

  async getProfiles(): Promise<AyrshareProfile[]> {
    const response = await fetch(`${AYRSHARE_API_BASE}/profiles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ayrshare API error: ${response.statusText}`);
    }

    return response.json();
  },

  async deletePost(postId: string): Promise<{ status: string }> {
    const response = await fetch(`${AYRSHARE_API_BASE}/delete/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ayrshare API error: ${response.statusText}`);
    }

    return response.json();
  },

  async getHistory(lastRecords: number = 50): Promise<any[]> {
    const response = await fetch(`${AYRSHARE_API_BASE}/history?lastRecords=${lastRecords}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ayrshare API error: ${response.statusText}`);
    }

    return response.json();
  },
};
