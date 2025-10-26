import api from "./api";

export type RequirementTypeEnums = 'STREAK' | 'WORKOUT_COUNT' 
                                | 'DURATION' | 'TOTAL_DURATION' |
                                 'TOTAL_WEIGHT_LIFTED' | 'MORNING_WORKOUTS' | 'EVENING_WORKOUTS'


export interface BadgeDTO{
    badge_name:string;
    badge_id: number;
    badge_description: string;
    earned_at: Date;
    requirement_type: RequirementTypeEnums;
    requirement_value: number;
    progress_value: number;
    completed: boolean;
}

export async function getAllBadges():Promise<BadgeDTO[]>{
    const res = await api.get("/badges/user/get/all")
    const data = res.data as any[]
    
    console.log('Backend response:', data);
    console.log('First item:', data[0]);

    return data.map((item, index) => ({
        badge_name: item.badge_name ?? item.name ?? item.badgeName ?? '',
        badge_id: Number(item.badge_id ?? item.id ?? item._id ?? index),
        badge_description: item.badge_description ?? item.description ?? item.badgeDescription ?? '',
        earned_at: item.earned_at
        ? new Date(item.earned_at)
        : item.earnedAt
        ? new Date(item.earnedAt)
        : new Date(), 
        requirement_type: (item.requirement_type ?? item.requirementType ?? 'WORKOUT_COUNT') as RequirementTypeEnums,
        requirement_value: Number(item.requirement_value ?? item.requirementValue ?? item.value ?? 0),
        progress_value: Number(item.progress_value ?? item.progress_value ?? item.value ?? 0),
        completed: Boolean(item.completed ?? false)
  }));
}