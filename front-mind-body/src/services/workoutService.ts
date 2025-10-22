import api from "./api";

export type WorkoutType = 'PUSH' | 'PULL' | 'LEGS';


export interface Workout {
    id: number;
    created_at: Date;
    workoutType: WorkoutType
    durationMinutes: number
    notes: string
}


export async function fetchWorkouts():Promise<Workout[]>{
    const res = await api.get("/getHistory")
    const data = res.data as any[]

    return data.map(item => ({
        id: item.id,
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
        workoutType: item.workoutType as WorkoutType,
        durationMinutes: item.durationMinutes,
        notes: item.notes
    }))
}