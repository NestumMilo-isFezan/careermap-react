<?php

namespace App\Http\Resources\Roadmap;

use App\Models\Exam;
use App\Models\Subject;
use App\Models\Academic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrerequisiteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $subject = Subject::find($this->subject_id);
        $academic = Academic::where('user_id', $request->user()->id)->first() ?? null;
        $status = "Not Passed";
        $studentGrade = null;
        if ($academic) {
            $exam = Exam::find($academic->exam_id)->examSubjects;
            $studentGrade = $exam->where('subject_id', $this->subject_id)->first()->grade;
            if (!$studentGrade) {
                $status = "Can't Taken This Exam";
            }
        } else {
            $status = "Exam Not Taken";
        }

        $gradeValues = [
            'A+' => 4, 'A' => 3.7, 'A-' => 3.3,
            'B+' => 3, 'B' => 2.7, 'B-' => 2.3,
            'C+' => 2, 'C' => 1.7, 'C-' => 1.3,
            'D+' => 1, 'D' => 0.7, 'D-' => 0.3,
            'F' => 0
        ];

        $numericGrade = $gradeValues[strtoupper($studentGrade)] ?? null;
        $requiredGrade = $gradeValues[strtoupper($this->requirement)] ?? null;

        if ($numericGrade !== null && $requiredGrade !== null && $numericGrade >= $requiredGrade) {
            $status = "Passed";
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'subject_name' => $subject->subject_name,
            'grade' => strtoupper($this->requirement),
            'user_grade' => $studentGrade,
            'status' => $status,
        ];
    }
}
