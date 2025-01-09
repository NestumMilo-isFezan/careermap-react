<?php

namespace App\Services;

use App\Models\User;
use App\Models\Roadmap;
use App\Models\Academic;
use App\Models\ExamSubject;
use App\Models\UserRoadmap;
use App\Models\UserMilestone;
use App\Models\UserChecklist;
use Illuminate\Support\Facades\DB;

class RoadmapCompatibilityService
{
    /**
     * Check roadmap compatibility for a student
     */
    public function processCompatibility($userId, $roadmapId)
    {
        DB::beginTransaction();
        try {
            $results = $this->checkCompatibility($userId, $roadmapId);
            $roadmap = Roadmap::with(['milestone.checklists'])->find($roadmapId);

            // Create user roadmap entry
            $userRoadmap = UserRoadmap::create([
                'user_id' => $userId,
                'roadmap_id' => $roadmapId,
                'status' => $results['compatible'] ? 'compatible' : 'incompatible'
            ]);

            // Get the Trial SPM milestone
            $trialSPMMilestone = $roadmap->milestone;

            if (!$trialSPMMilestone) {
                throw new \Exception('Trial SPM milestone not found');
            }

            $totalSubjects = $trialSPMMilestone->checklists->count();
            $passedSubjects = 0;

            // Create user milestone for Trial SPM
            $userMilestone = UserMilestone::create([
                'user_roadmap_id' => $userRoadmap->id,
                'milestone_id' => $trialSPMMilestone->id,
                'status' => 'in progress'
            ]);

            // Process each subject requirement
            foreach ($trialSPMMilestone->checklists as $checklist) {
                $subjectResult = $results['details'][$checklist->task] ?? null;
                $isFullfilled = $subjectResult && $subjectResult['met'];

                if ($isFullfilled) {
                    $passedSubjects++;
                }

                UserChecklist::create([
                    'user_milestone_id' => $userMilestone->id,
                    'checklist_id' => $checklist->id,
                    'status' => $isFullfilled ? 'fullfilled' : 'not fullfilled',
                    'completion_date' => $isFullfilled ? now() : null
                ]);
            }

            // Update milestone status based on all subjects
            $userMilestone->update([
                'status' => $passedSubjects === $totalSubjects ? 'completed' : 'in progress'
            ]);

            DB::commit();
            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get student's exam grades
     */
    private function getStudentGrades($userId)
    {
        $academic = Academic::where('user_id', $userId)->first();

        if (!$academic) {
            return [];
        }

        return ExamSubject::join('subjects', 'exam_subjects.subject_id', '=', 'subjects.id')
            ->where('exam_subjects.exam_id', $academic->exam_id)
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->subject_name => strtolower($item->grade)];
            })
            ->toArray();
    }

    /**
     * Get roadmap checklist requirements
     */
    private function getRoadmapRequirements($roadmapId)
    {
        return Roadmap::with(['milestone.checklists'])
            ->find($roadmapId)
            ->milestone
            ->checklists
            ->mapWithKeys(function ($checklist) {
                return [$checklist->task => strtolower($checklist->requirement)];
            })
            ->toArray();
    }

    /**
     * Compare grades against requirements
     */
    private function isGradeSufficient($actualGrade, $requiredGrade)
    {
        $gradeValues = [
            'a' => 4,
            'b' => 3,
            'c' => 2,
            'd' => 1,
            'e' => 0,
            'f' => 0
        ];

        return $gradeValues[strtolower($actualGrade)] >= $gradeValues[strtolower($requiredGrade)];
    }

    /**
     * Check compatibility between student grades and roadmap requirements
     */
    private function checkCompatibility($userId, $roadmapId)
    {
        $studentGrades = $this->getStudentGrades($userId);
        $roadmapRequirements = $this->getRoadmapRequirements($roadmapId);

        $results = [
            'compatible' => true,
            'details' => []
        ];

        foreach ($roadmapRequirements as $subject => $requiredGrade) {
            $actualGrade = $studentGrades[$subject] ?? null;

            if (!$actualGrade) {
                $results['compatible'] = false;
                $results['details'][$subject] = [
                    'required' => $requiredGrade,
                    'actual' => null,
                    'met' => false,
                    'message' => "Subject not found in student's records"
                ];
                continue;
            }

            $isSufficient = $this->isGradeSufficient($actualGrade, $requiredGrade);
            $results['compatible'] = $results['compatible'] && $isSufficient;

            $results['details'][$subject] = [
                'required' => $requiredGrade,
                'actual' => $actualGrade,
                'met' => $isSufficient,
                'message' => $isSufficient
                    ? "Meets requirement"
                    : "Grade too low (needs {$requiredGrade}, got {$actualGrade})"
            ];
        }

        return $results;
    }
}
