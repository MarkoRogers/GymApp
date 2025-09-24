import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Dumbbell, Clock, Target } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectWorkoutProgram } from '@/lib/db';
import { deleteProgram } from './actions';

export function WorkoutProgram({ program }: { program: SelectWorkoutProgram }) {
  const difficultyColors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-blue-100 text-blue-800', 
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-red-100 text-red-800'
  };

  const difficultyLabels = {
    1: 'Beginner',
    2: 'Easy',
    3: 'Medium', 
    4: 'Hard',
    5: 'Expert'
  };

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-8 w-8 text-primary" />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <div>
          <div className="font-semibold">{program.name}</div>
          <div className="text-sm text-muted-foreground">{program.description}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant="secondary" 
          className={difficultyColors[program.difficultyLevel as keyof typeof difficultyColors]}
        >
          {difficultyLabels[program.difficultyLevel as keyof typeof difficultyLabels]}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{program.durationWeeks} weeks</span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant={program.isActive ? "default" : "secondary"}>
          {program.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit Program</DropdownMenuItem>
            <DropdownMenuItem>Start Workout</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteProgram}>
                <input type="hidden" name="id" value={program.id} />
                <button type="submit" className="text-red-600">
                  Delete Program
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
