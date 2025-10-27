import api from './api';

// Define DTO inline here
export interface UserDTO {
  id: number;
  username: string;
  email: string;
  streak_count: number;
  longest_streak: number;
  totalMinutes: number;
  points: number;
  last_workout: string | null;
  created_at: string | null;
}

export async function getTopUsers(): Promise<UserDTO[]> {
  try {
    const res = await api.get('/user/top');
    return res.data as UserDTO[];
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    throw err;
  }
}
