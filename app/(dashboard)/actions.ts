'use server';

import { deleteWorkoutProgram } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteProgram(formData: FormData) {
  const id = Number(formData.get('id'));
  await deleteWorkoutProgram(id);
  revalidatePath('/programs');
}

// Placeholder for future fitness-related server actions
export async function createWorkoutSession(formData: FormData) {
  // TODO: Implement workout session creation
  revalidatePath('/dashboard');
}

export async function logExercise(formData: FormData) {
  // TODO: Implement exercise logging
  revalidatePath('/workouts');
}
