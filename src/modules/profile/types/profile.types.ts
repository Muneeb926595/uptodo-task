/**
 * Profile Types
 * User profile data structures
 */

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string; // Local file path or URI
  createdAt: number;
  updatedAt: number;
}

export interface CreateProfilePayload {
  name: string;
  email?: string;
  avatar?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  avatar?: string;
}
