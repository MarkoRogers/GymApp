'use server';

import { deleteWorkoutProgram } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteProgram(formData: FormData) {
  const id = Number(formData.get('id'));
  await deleteWorkoutProgram(id);
  revalidatePath('/programs');
}
