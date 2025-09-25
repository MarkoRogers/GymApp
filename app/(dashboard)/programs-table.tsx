'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { WorkoutProgram } from './product';
import { SelectWorkoutProgram } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export function ProgramsTable({
  programs,
  offset,
  totalPrograms
}: {
  programs: SelectWorkoutProgram[];
  offset: number;
  totalPrograms: number;
}) {
  const router = useRouter();
  const programsPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/programs/?offset=${offset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Workout Programs</CardTitle>
            <CardDescription>
              Manage your workout programs and track your fitness journey.
            </CardDescription>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Program</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Icon</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="hidden md:table-cell">Duration</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <WorkoutProgram key={program.id} program={program} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min(offset - programsPerPage, totalPrograms) + 1}-{offset}
            </strong>{' '}
            of <strong>{totalPrograms}</strong> programs
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === programsPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + programsPerPage > totalPrograms}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
