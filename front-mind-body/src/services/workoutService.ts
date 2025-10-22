import api from "./api";

export type WorkoutType = 'PUSH' | 'PULL' | 'LEGS';


export interface Workout {
    id: number;
    created_at: Date;
    workoutType: WorkoutType
    durationMinutes: number
    notes: string
}

export interface AddWorkoutDTO{
    user: User;
    workoutType: WorkoutType;
    durationMinutes: number;
}

export interface User{
    username: string;
    email: string;
    streak_count: number;
    longest_streak: number;
    last_workout?: string | Date;
}


function formatDateToLocalDate(value?: string | Date): string | undefined {
    if (!value) return undefined;
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return undefined;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}


export async function fetchWorkouts():Promise<Workout[]>{
    const res = await api.get("/getHistory")
    const data = res.data as any[]
    
    console.log('Backend response:', data);
    console.log('First item:', data[0]);

    return data.map((item, index) => ({
        id: item.id ?? item.workoutId ?? item._id ?? index, 
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
        workoutType: item.workoutType as WorkoutType,
        durationMinutes: item.durationMinutes,
        notes: item.notes
    }))
}

export async function addWorkout(payload: AddWorkoutDTO): Promise<string> {
    try {

        const userForBackend: any = {
            username: payload.user.username,
            email: payload.user.email,
            streak_count: payload.user.streak_count,
            longest_streak: payload.user.longest_streak
        };

        const formattedLastWorkout = formatDateToLocalDate(payload.user.last_workout);
        if (formattedLastWorkout) userForBackend.last_workout = formattedLastWorkout;

        const body = {
            user: userForBackend,
            workoutType: payload.workoutType,
            durationMinutes: payload.durationMinutes
        };

        const res = await api.post('/addWorkout', body);
        return res.data as string;
    } catch (err) {
        console.error('addWorkout error', err);
        throw err;
    }
}

