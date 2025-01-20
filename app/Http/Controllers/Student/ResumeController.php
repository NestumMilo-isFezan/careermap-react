<?php

namespace App\Http\Controllers\Student;

use App\Models\Exam;
use Inertia\Inertia;
use App\Models\Resume;
use App\Models\Subject;
use App\Models\SoftSkill;
use App\Models\Curriculum;
use App\Models\ExamSubject;
use App\Models\ResumeSkill;
use Illuminate\Http\Request;
use App\Models\ResumeLanguage;
use Illuminate\Support\Carbon;
use App\Models\CurriculumPoint;
use App\Models\ResumeEducation;
use App\Models\ResumeSoftSkill;
use App\Models\ResumeExperience;
use Illuminate\Support\Facades\DB;
use App\Models\ResumeCertification;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ResumeController extends Controller
{
    public function index(){
        if(Resume::where('user_id', Auth::id())->exists()){
            return redirect()->route('student.resume.edit');
        }
        return Inertia::render('Student/Resume/Index');
    }

    public function create(){
        if(Resume::where('user_id', Auth::id())->exists()){
            return redirect()->route('student.resume.index')->with('error', 'You already have a resume');
        }


        if(Auth::user()->academic){
            $examId = Auth::user()->academic->exam_id;
            $languages = ExamSubject::where('exam_id', $examId)
                ->whereHas('subject', function($query) {
                    $query->where('type', 'language');
                })
                ->get()
                ->map(function($examSubject) {
                    $subjectName = $examSubject->subject->subject_name;
                    $subjectGrade = $examSubject->grade;
                    switch($subjectGrade){
                        case 'A+':
                        case 'A':
                        case 'A-':
                            $level = 'advanced';
                            break;
                        case 'B+':
                        case 'B':
                            $level = 'intermediate';
                            break;
                        case 'B-':
                        case 'C+':
                        case 'C':
                            $level = 'basic';
                            break;
                        default:
                            $level = 'beginner';
                    }
                    return [
                        'language' => $subjectName,
                        'level' => $level,
                    ];
                })->toArray();
        }
        else{
            $languages = [
                [
                    'language' => '',
                    'level' => '',
                ],
            ];
        }


        if(Auth::user()->student->curriculums){
            $studentId = Auth::user()->student->id;

            $certificates = $this->getCurriculumData($studentId, 'certificates');
            $experiences = $this->getCurriculumData($studentId, 'activities');
            $softSkills = $this->getSoftSkill($studentId);
        }
        else{
            $certificates = [
                [
                    'certification' => '',
                    'date_of_issue' => '',
                ],
            ];
            $experiences = [
                [
                    'activity' => '',
                    'position' => '',
                    'start_date' => '',
                    'end_date' => '',
                ],
            ];
            $softSkills = [
                [
                    'soft_skill' => '',
                    'level' => '',
                ],
            ];
        }

        $resumePrefillData = [
            'profile' => [
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                'phone' => Auth::user()->profile->phone,
                'address' => Auth::user()->profile->address,
                'image' => null,
                'image_preview' => asset('storage/' . Auth::user()->image),
            ],
            'summary' => fake()->paragraph(),
            'education' => [
                [
                    'school' => Auth::user()->student->school->name,
                    'education_level' => 'SPM',
                    'start_date' => '2015-01-01',
                    'end_date' => '2019-12-01',
                ],
            ],
            'experiences' => $experiences,
            'certifications' => $certificates,
            'skills' => [
                [
                    'skill' => '',
                    'level' => '',
                ],
            ],
            'soft_skills' => $softSkills,
            'languages' => $languages,
        ];
        return Inertia::render('Student/Resume/CreateEdit', [
            'resumePrefillData' => $resumePrefillData,
        ]);
    }

    public function store(Request $request){
        // Start a database transaction
        return DB::transaction(function () use ($request) {
            try {
                $validated = $request->validate([
                    'profile.name' => 'required|string|max:255',
                    'profile.email' => 'required|email|max:255',
                    'profile.phone' => 'required|string|max:20',
                    'profile.address' => 'required|string|max:500',
                    'profile.image' => 'nullable|image|max:2048',

                    'summary' => 'required|string|max:1000',

                    'education' => 'required|array|min:1',
                    'education.*.school' => 'required|string|max:255',
                    'education.*.education_level' => 'required|string|max:50',
                    'education.*.start_date' => 'required|date',
                    'education.*.end_date' => 'required|date|after:education.*.start_date',

                    'experiences' => 'required|array|min:1',
                    'experiences.*.activity' => 'required|string|max:255',
                    'experiences.*.position' => 'required|string|max:255',
                    'experiences.*.start_date' => 'required|date',
                    'experiences.*.end_date' => 'required|date|after:experiences.*.start_date',

                    'certifications' => 'required|array|min:1',
                    'certifications.*.certification' => 'required|string|max:255',
                    'certifications.*.date_of_issue' => 'required|date',

                    'skills' => 'required|array|min:1',
                    'skills.*.skill' => 'required|string|max:100',
                    'skills.*.level' => ['required', 'string', 'in:beginner,basic,intermediate,advanced'],

                    'soft_skills' => 'required|array|min:1',
                    'soft_skills.*.soft_skill' => 'required|string|max:100',

                    'languages' => 'required|array|min:1',
                    'languages.*.language' => 'required|string|max:100',
                    'languages.*.level' => ['required', 'string', 'in:beginner,basic,intermediate,advanced'],
                ], [
                    // Custom error messages for nested arrays
                    'education.*.school.required' => 'School name is required',
                    'education.*.education_level.required' => 'Education level is required',
                    'education.*.start_date.required' => 'Start date is required',
                    'education.*.end_date.required' => 'End date is required',
                    'education.*.end_date.after' => 'End date must be after start date',

                    'experiences.*.activity.required' => 'Activity is required',
                    'experiences.*.position.required' => 'Position is required',
                    'experiences.*.start_date.required' => 'Start date is required',
                    'experiences.*.end_date.required' => 'End date is required',
                    'experiences.*.end_date.after' => 'End date must be after start date',

                    'certifications.*.certification.required' => 'Certification name is required',
                    'certifications.*.date_of_issue.required' => 'Date of issue is required',

                    'skills.*.skill.required' => 'Skill name is required',
                    'skills.*.level.required' => 'Skill level is required',
                    'skills.*.level.in' => 'Invalid skill level selected',

                    'soft_skills.*.soft_skill.required' => 'Soft skill name is required',

                    'languages.*.language.required' => 'Language name is required',
                    'languages.*.level.required' => 'Language level is required',
                    'languages.*.level.in' => 'Invalid language level selected',
                ]);

                // Handle profile image upload if provided
                $profileImage = null;
                if ($request->hasFile('profile.image')) {
                    $profileImage = $request->file('profile.image')->store('resume-images', 'public');
                }
                else{
                    $profileImage = Auth::user()->image;
                }

                // Create the main resume record
                $resume = Resume::create([
                    'user_id' => Auth::id(),
                    'image' => $profileImage,
                    'name' => $validated['profile']['name'],
                    'email' => $validated['profile']['email'],
                    'phone' => $validated['profile']['phone'],
                    'address' => $validated['profile']['address'],
                    'summary' => $validated['summary'],
                ]);

                // Bulk insert education records
                $educationRecords = collect($validated['education'])->map(function ($education) use ($resume) {
                    return [
                        'school' => $education['school'],
                        'education_level' => $education['education_level'],
                        'start_date' => Carbon::parse($education['start_date'])->format('Y-m-d'),
                        'end_date' => Carbon::parse($education['end_date'])->format('Y-m-d'),
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeEducation::insert($educationRecords);

                // Bulk insert experience records
                $experienceRecords = collect($validated['experiences'])->map(function ($experience) use ($resume) {
                    return [
                        'activity' => $experience['activity'],
                        'position' => $experience['position'],
                        'start_date' => Carbon::parse($experience['start_date'])->format('Y-m-d'),
                        'end_date' => Carbon::parse($experience['end_date'])->format('Y-m-d'),
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeExperience::insert($experienceRecords);

                // Bulk insert certification records
                $certificationRecords = collect($validated['certifications'])->map(function ($certification) use ($resume) {
                    return [
                        'certification' => $certification['certification'],
                        'date_of_issue' => Carbon::parse($certification['date_of_issue'])->format('Y-m-d'),
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeCertification::insert($certificationRecords);

                // Bulk insert skill records
                $skillRecords = collect($validated['skills'])->map(function ($skill) use ($resume) {
                    return [
                        'skill' => $skill['skill'],
                        'level' => $skill['level'],
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeSkill::insert($skillRecords);

                // Bulk insert soft skill records
                $softSkillRecords = collect($validated['soft_skills'])->map(function ($softSkill) use ($resume) {
                    return [
                        'soft_skill' => $softSkill['soft_skill'],
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeSoftSkill::insert($softSkillRecords);

                // Bulk insert language records
                $languageRecords = collect($validated['languages'])->map(function ($language) use ($resume) {
                    return [
                        'language' => $language['language'],
                        'level' => $language['level'],
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeLanguage::insert($languageRecords);

                return redirect()->route('student.resume.index')
                    ->with('success_message', 'Resume created successfully');

            } catch (\Illuminate\Validation\ValidationException $e) {
                throw $e;
            } catch (\Exception $e) {
                throw $e;
            }
        });
    }

    public function edit(){
        $resume = Resume::where('user_id', Auth::id())->first();
        $profileImage = $resume->image;

        $resumeEditData = [
            'profile' => [
                'name' => $resume->name,
                'email' => $resume->email,
                'phone' => $resume->phone,
                'address' => $resume->address,
                'image' => null,
                'image_preview' => asset('storage/' . $resume->image),
            ],
            'summary' => $resume->summary,
            'education' => $resume->education->map(function($education) {
                return [
                    'school' => $education->school,
                    'education_level' => $education->education_level,
                    'start_date' => $education->start_date,
                    'end_date' => $education->end_date,
                ];
            })->toArray(),
            'experiences' => $resume->experience->map(function($experience) {
                return [
                    'activity' => $experience->activity,
                    'position' => $experience->position,
                    'start_date' => $experience->start_date,
                    'end_date' => $experience->end_date,
                ];
            })->toArray(),
            'certifications' => $resume->certification->map(function($certification) {
                return [
                    'certification' => $certification->certification,
                    'date_of_issue' => $certification->date_of_issue,
                ];
            })->toArray(),
            'skills' => $resume->skill->map(function($skill) {
                return [
                    'skill' => $skill->skill,
                    'level' => $skill->level,
                ];
            })->toArray(),
            'soft_skills' => $resume->softSkill->map(function($softSkill) {
                return [
                    'soft_skill' => $softSkill->soft_skill,
                ];
            })->toArray(),
            'languages' => $resume->language->map(function($language) {
                return [
                    'language' => $language->language,
                    'level' => $language->level,
                ];
            })->toArray(),
        ];

        return Inertia::render('Student/Resume/CreateEdit', [
            'edit' => true,
            'resumeEditData' => $resumeEditData,
        ]);
    }

    public function update(Request $request){
        // Start a database transaction
        return DB::transaction(function () use ($request) {
            try {
                $validated = $request->validate([
                    'profile.name' => 'required|string|max:255',
                    'profile.email' => 'required|email|max:255',
                    'profile.phone' => 'required|string|max:20',
                    'profile.address' => 'required|string|max:500',
                    'profile.image' => 'nullable|image|max:2048',

                    'summary' => 'required|string|max:1000',

                    'education' => 'required|array|min:1',
                    'education.*.school' => 'required|string|max:255',
                    'education.*.education_level' => 'required|string|max:50',
                    'education.*.start_date' => 'required|date',
                    'education.*.end_date' => 'required|date|after:education.*.start_date',

                    'experiences' => 'required|array|min:1',
                    'experiences.*.activity' => 'required|string|max:255',
                    'experiences.*.position' => 'required|string|max:255',
                    'experiences.*.start_date' => 'required|date',
                    'experiences.*.end_date' => 'required|date|after:experiences.*.start_date',

                    'certifications' => 'required|array|min:1',
                    'certifications.*.certification' => 'required|string|max:255',
                    'certifications.*.date_of_issue' => 'required|date',

                    'skills' => 'required|array|min:1',
                    'skills.*.skill' => 'required|string|max:100',
                    'skills.*.level' => ['required', 'string', 'in:beginner,basic,intermediate,advanced'],

                    'soft_skills' => 'required|array|min:1',
                    'soft_skills.*.soft_skill' => 'required|string|max:100',

                    'languages' => 'required|array|min:1',
                    'languages.*.language' => 'required|string|max:100',
                    'languages.*.level' => ['required', 'string', 'in:beginner,basic,intermediate,advanced'],
                ]);

                $resume = Resume::where('user_id', Auth::id())->firstOrFail();

                // Handle profile image upload if provided
                if ($request->hasFile('profile.image')) {
                    $profileImage = $request->file('profile.image')->store('resume-images', 'public');
                }
                else{
                    $profileImage = $resume->image;
                }

                // Update main resume record
                $resume->update([
                    'image' => $profileImage,
                    'name' => $validated['profile']['name'],
                    'email' => $validated['profile']['email'],
                    'phone' => $validated['profile']['phone'],
                    'address' => $validated['profile']['address'],
                    'summary' => $validated['summary'],
                ]);

                // Delete existing related records
                $resume->education()->delete();
                $resume->experience()->delete();
                $resume->certification()->delete();
                $resume->skill()->delete();
                $resume->softSkill()->delete();
                $resume->language()->delete();

                // Recreate education records
                $educationRecords = collect($validated['education'])->map(function ($education) use ($resume) {
                    return [
                        'school' => $education['school'],
                        'education_level' => $education['education_level'],
                        'start_date' => Carbon::parse($education['start_date'])->format('Y-m-d'),
                        'end_date' => Carbon::parse($education['end_date'])->format('Y-m-d'),
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeEducation::insert($educationRecords);

                // Recreate experience records
                $experienceRecords = collect($validated['experiences'])->map(function ($experience) use ($resume) {
                    return [
                        'activity' => $experience['activity'],
                        'position' => $experience['position'],
                        'start_date' => Carbon::parse($experience['start_date'])->format('Y-m-d'),
                        'end_date' => Carbon::parse($experience['end_date'])->format('Y-m-d'),
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeExperience::insert($experienceRecords);

                // Recreate certification records
                $certificationRecords = collect($validated['certifications'])->map(function ($certification) use ($resume) {
                    return [
                        'certification' => $certification['certification'],
                        'date_of_issue' => Carbon::parse($certification['date_of_issue'])->format('Y-m-d'),
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeCertification::insert($certificationRecords);

                // Recreate skill records
                $skillRecords = collect($validated['skills'])->map(function ($skill) use ($resume) {
                    return [
                        'skill' => $skill['skill'],
                        'level' => $skill['level'],
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeSkill::insert($skillRecords);

                // Recreate soft skill records
                $softSkillRecords = collect($validated['soft_skills'])->map(function ($softSkill) use ($resume) {
                    return [
                        'soft_skill' => $softSkill['soft_skill'],
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeSoftSkill::insert($softSkillRecords);

                // Recreate language records
                $languageRecords = collect($validated['languages'])->map(function ($language) use ($resume) {
                    return [
                        'language' => $language['language'],
                        'level' => $language['level'],
                        'resume_id' => $resume->id,
                    ];
                })->toArray();
                ResumeLanguage::insert($languageRecords);

                return redirect()->route('student.resume.index')
                    ->with('success_message', 'Resume updated successfully');

            } catch (\Illuminate\Validation\ValidationException $e) {
                throw $e;
            } catch (\Exception $e) {
                throw $e;
            }
        });
    }

    public function destroy(){
        $resume = Resume::where('user_id', Auth::id())->firstOrFail();
        $resume->delete();
        return redirect()->route('student.resume.create')->with('success_message', 'Resume resync successfully');
    }

    private function getSoftSkill($studentId){
        $points = CurriculumPoint::where('student_id', $studentId)->get();
        $skillPoints = SoftSkill::all()->map(function ($softSkill) use ($points) {
            $totalPoints = $points->where('soft_skill_id', $softSkill->id)
                ->sum('score');

            return [
                'name' => $softSkill->name,
                'description' => $softSkill->description,
                'points' => $totalPoints
            ];
        })
        ->sortByDesc('points')
        ->values()
        ->take(3);

        $softSkills = [];
        foreach($skillPoints as $skill){
            $softSkills[] = [
                'soft_skill' => $skill['name'],
            ];
        }

        return $softSkills;
    }

    private function getCurriculumData($studentId, $type) {
        $curriculum = Curriculum::where('student_id', $studentId)
            ->where('status', 'approved')
            ->where('type', $type)
            ->get();

        if ($curriculum->isEmpty()) {
            return [
                [
                    $type === 'certificates' ? 'certification' : 'activity' => '',
                    'date_of_issue' => $type === 'certificates' ? '' : '',
                    'position' => $type === 'activities' ? '' : null,
                    'start_date' => $type === 'activities' ? '' : null,
                    'end_date' => $type === 'activities' ? '' : null,
                ],
            ];
        }

        return $curriculum->map(function($item) use ($type) {
            return [
                $type === 'certificates' ? 'certification' : 'activity' => $item->name,
                'date_of_issue' => $type === 'certificates' ? $item->updated_at : null,
                'position' => $type === 'activities' ? "" : null,
                'start_date' => $type === 'activities' ? "" : null,
                'end_date' => $type === 'activities' ? "" : null,
            ];
        })->toArray();
    }
}
