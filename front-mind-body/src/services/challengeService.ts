import api from './api';

export interface ChallengeDTO {
  userChallengeId: number;
  challengeId: number;
  challengeName: string;
  challengeDescription: string;
  challengeType: 'DAILY' | 'WEEKLY';
  requirementValue: number;
  currentProgress: number;
  points: number;
  completed: boolean;
  claimed: boolean;
  assignedDate: string;
}

export interface ClaimChallengeResponse {
  success: boolean;
  pointsAwarded: number;
  newTotalPoints: number;
  message: string;
}

export const getActiveChallenges = async (): Promise<ChallengeDTO[]> => {
  try {
    const response = await api.get('/challenges/user/active');
    
    return response.data.map((item: any, index: number) => ({
      userChallengeId: item.userChallengeId ?? item.id ?? index,
      challengeId: item.challengeId ?? item.challenge_id ?? 0,
      challengeName: item.challengeName ?? item.challenge_name ?? 'Unknown Challenge',
      challengeDescription: item.challengeDescription ?? item.challenge_description ?? '',
      challengeType: item.challengeType ?? item.challenge_type ?? 'DAILY',
      requirementValue: item.requirementValue ?? item.requirement_value ?? 0,
      currentProgress: item.currentProgress ?? item.current_progress ?? 0,
      points: item.points ?? 0,
      completed: item.completed ?? false,
      claimed: item.claimed ?? false,
      assignedDate: item.assignedDate ?? item.assigned_date ?? ''
    }));
  } catch (error) {
    console.error('Failed to fetch challenges:', error);
    throw error;
  }
};

export const claimChallenge = async (userChallengeId: number): Promise<ClaimChallengeResponse> => {
  try {
    const response = await api.post('/challenges/user/claim', {
      userChallengeId
    });
    
    return {
      success: response.data.success ?? true,
      pointsAwarded: response.data.pointsAwarded ?? response.data.points_awarded ?? 0,
      newTotalPoints: response.data.newTotalPoints ?? response.data.new_total_points ?? 0,
      message: response.data.message ?? 'Challenge claimed!'
    };
  } catch (error) {
    console.error('Failed to claim challenge:', error);
    throw error;
  }
};
