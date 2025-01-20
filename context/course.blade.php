<?php

use Livewire\Attributes\{Layout, Title, Computed, On};
use Livewire\WithPagination;
use Livewire\WithFileUploads;
use Livewire\Volt\Component;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\CoursesImport;
use App\Models\Course;
use App\Models\Domain;

new
#[Layout('layouts.admin')]
#[Title('Manage Courses')]
class extends Component {

    use WithPagination;
    use WithFileUploads;

    public $file;
    public $previewData = [];
    public $isImporting = false;
    public $importFinished = false;
    public $errorMessage = '';
    public $successMessage = '';
    public $showImportModal = false;
    public $reconciliationData = [];
    public $showReconciliation = false;
    public $selectedActions = [];

    #[On('refresh-courses')]
    #[Computed(persist: true)]
    public function courses() {
        return Course::paginate(10);
    }

    public function openImportModal()
    {
        $this->resetImport();
        $this->dispatch('open-modal', name: 'import-modal');
    }

    public function updatedFile()
    {
        $this->validate([
            'file' => 'required|mimes:xlsx,xls|max:51200', // 50MB max
        ]);

        try {
            // Create CoursesImport instance
            $import = new CoursesImport();

            // Get the raw data
            $rawData = Excel::toCollection($import, $this->file)->first()->take(5);

            // Track current faculty
            $currentFaculty = null;

            // Process each row to show domain matching
            $this->previewData = $rawData->map(function ($row) use ($import, &$currentFaculty) {
                // Update currentFaculty if the row has a faculty value
                if (!empty($row['fakulti'])) {
                    $currentFaculty = $row['fakulti'];
                }

                // Use current faculty if row's faculty is empty
                $fakulti = !empty($row['fakulti']) ? $row['fakulti'] : $currentFaculty;
                $courseName = $row['program_name'] ?? '';

                // Create a reflection to access private method
                $reflection = new \ReflectionClass($import);
                $findDomainId = $reflection->getMethod('findDomainId');
                $findDomainId->setAccessible(true);

                // Get domain ID and find domain name
                $domainId = $findDomainId->invoke($import, $courseName, $fakulti);
                $domain = $domainId ? Domain::find($domainId) : null;

                return [
                    'fakulti' => $fakulti, // Use tracked faculty
                    'program_name' => $courseName,
                    'matched_domain' => $domain ? $domain->name : 'No Match',
                ];
            })->toArray();

            $this->successMessage = 'File uploaded successfully. Review the preview below.';
            $this->errorMessage = '';
        } catch (\Exception $e) {
            $this->errorMessage = 'Error reading file: ' . $e->getMessage();
            $this->successMessage = '';
        }
    }

    public function prepareReconciliation()
    {
        $this->validate([
            'file' => 'required|mimes:xlsx,xls|max:51200',
        ]);

        try {
            // Get the raw data from Excel
            $import = new CoursesImport();
            $rawData = Excel::toCollection($import, $this->file)->first();

            // Track current faculty
            $currentFaculty = null;

            // Get existing courses
            $existingCourses = Course::all()->keyBy(function ($course) {
                return strtolower($course->course_name . '-' . $course->institution_name);
            });

            // Reset selected actions
            $this->selectedActions = [];

            // Compare and prepare reconciliation data
            $this->reconciliationData = $rawData->map(function ($row) use ($import, $existingCourses, &$currentFaculty) {
                // Update currentFaculty if the row has a faculty value
                if (!empty($row['fakulti'])) {
                    $currentFaculty = $row['fakulti'];
                }

                // Use current faculty if row's faculty is empty
                $fakulti = !empty($row['fakulti']) ? $row['fakulti'] : $currentFaculty;

                $courseName = $row['program_name'] ?? '';
                $institutionName = $row['institution_name'] ?? 'UMS';
                $key = strtolower($courseName . '-' . $institutionName);

                // Find matching domain
                $reflection = new \ReflectionClass($import);
                $findDomainId = $reflection->getMethod('findDomainId');
                $findDomainId->setAccessible(true);
                $domainId = $findDomainId->invoke($import, $courseName, $fakulti);
                $domain = $domainId ? Domain::find($domainId) : null;

                $existing = $existingCourses->get($key);

                // Check if there are any changes
                $hasChanges = $existing ? $this->hasChanges($existing, [
                    'course_name' => $courseName,
                    'institution_name' => $institutionName,
                    'faculty_name' => $fakulti,
                    'domain_id' => $domainId,
                ]) : true;

                // Skip if existing record has no changes
                if ($existing && !$hasChanges) {
                    return null;
                }

                // Set default action
                $action = $existing ? 'update' : 'create';
                $this->selectedActions[$key] = $action;

                return [
                    'key' => $key,
                    'new_data' => [
                        'course_name' => $courseName,
                        'institution_name' => $institutionName,
                        'faculty_name' => $fakulti,
                        'domain' => $domain ? $domain->name : 'No Match',
                    ],
                    'existing_data' => $existing ? [
                        'course_name' => $existing->course_name,
                        'institution_name' => $existing->institution_name,
                        'faculty_name' => $existing->faculty_name,
                        'domain' => $existing->domain->name ?? 'No Domain',
                    ] : null,
                    'status' => $existing ? 'update' : 'create',
                    'has_changes' => $hasChanges,
                ];
            })
            ->filter() // Remove null values
            ->values() // Reset array keys
            ->toArray();

            $this->showReconciliation = true;
            $this->successMessage = count($this->reconciliationData) > 0
                ? 'Please review the changes below before importing.'
                : 'No changes detected in the imported data.';
            $this->errorMessage = '';
        } catch (\Exception $e) {
            $this->errorMessage = 'Error preparing reconciliation: ' . $e->getMessage();
            $this->successMessage = '';
        }
    }

    private function hasChanges($existing, $newData)
    {
        return $existing->course_name !== $newData['course_name'] ||
               $existing->institution_name !== $newData['institution_name'] ||
               $existing->faculty_name !== $newData['faculty_name'] ||
               $existing->domain_id !== $newData['domain_id'];
    }

    public function import()
    {
        $this->validate([
            'file' => 'required|mimes:xlsx,xls|max:51200',
        ]);

        if (empty($this->selectedActions)) {
            $this->errorMessage = 'No actions selected for import';
            return;
        }

        $this->isImporting = true;
        $this->importFinished = false;
        $this->errorMessage = '';

        try {
            // Create import instance with selected actions
            $import = new CoursesImport($this->selectedActions);

            // Perform the import
            Excel::import($import, $this->file);

            $this->successMessage = 'Import completed successfully!';
            $this->importFinished = true;

            // Reset the form and refresh the data
            $this->resetImport();
            $this->dispatch('refresh-courses');
            $this->dispatch('notify', variant: 'success', title: 'Import Success', message: 'Courses imported successfully!');
            $this->dispatch('close-modal', name: 'import-modal');
        } catch (\Exception $e) {
            $this->errorMessage = 'Error during import: ' . $e->getMessage();
            logger()->error('Course import error: ' . $e->getMessage());
        }

        $this->isImporting = false;
    }

    public function resetImport()
    {
        $this->reset([
            'file',
            'previewData',
            'reconciliationData',
            'showReconciliation',
            'selectedActions',
            'isImporting',
            'importFinished',
            'errorMessage',
            'successMessage'
        ]);
    }

    public function debug()
    {
        logger()->info('Selected Actions:', $this->selectedActions);
        logger()->info('Reconciliation Data:', $this->reconciliationData);
    }
};
?>

<section>
    <div class="bg-stone-50/80 p-5 pt-8 pb-5 rounded-2xl shadow-lg min-h-screen w-full space-y-4 mx-auto mt-4 max-w-7xl">
        <div class="mx-auto px-5 w-full flex flex-row justify-between">
            <div class="flex flex-col">
                <h2 class="text-2xl font-bold tracking-tight text-stone-800">Manage Courses</h2>
                <span class="text-sm text-emerald-900/70">Import and manage course data</span>
            </div>
            <x-mary-button label="Import Courses" wire:click="openImportModal" class="btn-primary btn-sm" responsive />
        </div>

        @php
            $headers = [
                ['key' => 'course_name', 'label' => 'Course'],
                ['key' => 'institution_name', 'label' => 'Institution'],
                ['key' => 'domain_id', 'label' => 'Domain'],
                ['key' => 'actions', 'label' => 'Actions']
            ];
        @endphp

        <div class="overflow-hidden w-full overflow-x-auto rounded-md border border-emerald-700">
            <table class="w-full text-left text-sm text-emerald-900">
                <thead class="border-b border-emerald-700 bg-emerald-400 text-sm text-neutral-900">
                    <tr>
                        @foreach ($headers as $header)
                            <th scope="col" class="px-4 py-3">{{ $header['label'] }}</th>
                        @endforeach
                    </tr>
                </thead>
                <tbody class="divide-y divide-emerald-700">
                    @if($this->courses->count() > 0)
                        @foreach ($this->courses as $course)
                            <tr class="even:bg-emerald-900/10">
                                <td class="p-4">
                                    <div class="flex w-max items-center gap-2">
                                        <div class="flex flex-col">
                                            <span class="text-emerald-900 text-md">{{ Str::limit($course->course_name, 70) }}</span>
                                            <span class="text-sm text-green-700/70">{{ $course->faculty_name }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4">{{ $course->institution_name }}</td>
                                <td class="p-4">{{ $course->domain->name }}</td>
                                <td class="p-4">
                                    <x-mary-button label="View" class="btn-accent btn-sm" responsive />
                                </td>
                            </tr>
                        @endforeach
                    @else
                        <tr>
                            <td colspan="4" class="text-center py-4">
                                <x-mary-icon name="o-cube" label="No Courses Available." class="text-emerald-900" />
                            </td>
                        </tr>
                    @endif
                </tbody>
            </table>
        </div>
        <div class="flex justify-end pb-4">
            {{ $this->courses->links('components.custom.pagination') }}
        </div>

        <!-- Import Modal -->
        <x-custom.form-modal wire:submit.prevent="import" title="Import Courses" name="import-modal">
            <article class="group flex rounded-md flex-col border border-green-300 bg-green-50 text-emerald-900" style="max-height: 80vh;">
                <div class="w-full p-3 space-y-4 overflow-hidden flex flex-col">
                    <!-- Header -->
                    <div class="flex-none">
                        <div class="flex flex-col pb-4">
                            <h1 class="text-2xl font-semibold tracking-tight">Import Courses</h1>
                            <p class="text-sm text-neutral-500">Upload an Excel file containing course data.</p>
                        </div>

                        <!-- File Upload Section -->
                        <div class="space-y-4">
                            <input type="file" wire:model="file" class="block w-full text-sm text-emerald-900
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-emerald-50 file:text-emerald-700
                                hover:file:bg-emerald-100
                            "/>

                            @if($successMessage)
                                <div class="text-emerald-500 text-sm">{{ $successMessage }}</div>
                            @endif
                        </div>
                    </div>

                    <!-- Content Area - Make it scrollable -->
                    <div class="flex-1 min-h-0 overflow-auto">
                        <!-- Preview Content -->
                        @if(!$showReconciliation && count($previewData) > 0)
                            <div class="border rounded-lg overflow-hidden">
                                <div class="px-4 py-3 bg-emerald-100 border-b border-emerald-200">
                                    <h3 class="font-semibold text-emerald-900">Data Preview with Domain Matching</h3>
                                </div>
                                <div class="overflow-x-auto max-h-[400px]">
                                    <table class="min-w-full divide-y divide-emerald-200">
                                        <thead class="bg-emerald-50">
                                            <tr>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-500 uppercase tracking-wider sticky top-0 bg-emerald-50">
                                                    Faculty
                                                </th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-500 uppercase tracking-wider sticky top-0 bg-emerald-50">
                                                    Program Name
                                                </th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-500 uppercase tracking-wider sticky top-0 bg-emerald-50">
                                                    Matched Domain
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-emerald-200">
                                            @foreach($previewData as $row)
                                                <tr class="hover:bg-emerald-50">
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                                                        {{ $row['fakulti'] }}
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                                                        {{ $row['program_name'] }}
                                                    </td>
                                                    <td @class([
                                                        'px-6 py-4 whitespace-nowrap text-sm',
                                                        'text-emerald-600 font-medium' => $row['matched_domain'] !== 'No Match',
                                                        'text-red-600 font-medium' => $row['matched_domain'] === 'No Match'
                                                    ])>
                                                        {{ $row['matched_domain'] }}
                                                    </td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        @endif

                        <!-- Reconciliation Content -->
                        @if($showReconciliation && count($reconciliationData) > 0)
                            <div class="border rounded-lg">
                                <div class="px-4 py-3 bg-emerald-100 border-b border-emerald-200">
                                    <h3 class="font-semibold text-emerald-900">Data Reconciliation</h3>
                                    <p class="text-sm text-emerald-600">Review changes before importing</p>
                                </div>
                                <div class="overflow-auto">
                                    <table class="w-full text-sm text-left">
                                        <thead class="text-xs uppercase bg-emerald-50 sticky top-0 z-10">
                                            <tr>
                                                <th scope="col" class="px-4 py-3 w-[40%]">Course</th>
                                                <th scope="col" class="px-4 py-3 w-[10%]">Status</th>
                                                <th scope="col" class="px-4 py-3 w-[35%]">Changes</th>
                                                <th scope="col" class="px-4 py-3 w-[15%]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-emerald-200">
                                            @foreach($reconciliationData as $item)
                                                <tr class="hover:bg-emerald-50">
                                                    <td class="px-4 py-3">
                                                        <div class="text-emerald-900">{{ $item['new_data']['course_name'] }}</div>
                                                        <div class="text-xs text-emerald-600">{{ $item['new_data']['institution_name'] }}</div>
                                                    </td>
                                                    <td class="px-4 py-3">
                                                        @if($item['status'] === 'create')
                                                            <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                                New
                                                            </span>
                                                        @else
                                                            <span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                                Update
                                                            </span>
                                                        @endif
                                                    </td>
                                                    <td class="px-4 py-3">
                                                        @if($item['existing_data'])
                                                            <div class="space-y-2">
                                                                @php
                                                                    $fields = [
                                                                        'course_name' => 'Course Name',
                                                                        'faculty_name' => 'Faculty',
                                                                        'domain' => 'Domain'
                                                                    ];
                                                                    $changedFields = [];
                                                                    foreach ($fields as $field => $label) {
                                                                        if ($item['new_data'][$field] !== $item['existing_data'][$field]) {
                                                                            $changedFields[$label] = [
                                                                                'old' => $item['existing_data'][$field],
                                                                                'new' => $item['new_data'][$field]
                                                                            ];
                                                                        }
                                                                    }
                                                                @endphp

                                                                @if(empty($changedFields))
                                                                    <span class="text-xs text-emerald-600">No changes</span>
                                                                @else
                                                                    @foreach($changedFields as $label => $values)
                                                                        <div class="text-xs">
                                                                            <span class="font-medium">{{ $label }}:</span>
                                                                            <div class="ml-2">
                                                                                <div class="text-red-500 line-through">{{ $values['old'] }}</div>
                                                                                <div class="text-green-500">→ {{ $values['new'] }}</div>
                                                                            </div>
                                                                        </div>
                                                                    @endforeach
                                                                @endif
                                                            </div>
                                                        @else
                                                            <span class="text-xs text-emerald-600">All fields will be added</span>
                                                        @endif
                                                    </td>
                                                    <td class="px-4 py-3">
                                                        <select
                                                            wire:model.live="selectedActions.{{ $item['key'] }}"
                                                            class="w-full text-xs border-emerald-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                                        >
                                                            <option value="create" @if($item['status'] === 'create') selected @endif>Create</option>
                                                            <option value="update" @if($item['status'] === 'update') selected @endif>Update</option>
                                                            <option value="skip">Skip</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        @endif
                    </div>

                    @if($errorMessage)
                        <div class="text-red-500 text-sm flex-none">{{ $errorMessage }}</div>
                    @endif
                </div>
            </article>

            <x-slot:footer>
                <button type="button"
                    @click="$dispatch('close-modal', {name: 'import-modal'})"
                    class="inline-flex justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                    Cancel
                </button>

                @if(!$showReconciliation && count($previewData) > 0)
                    <button type="button"
                        wire:click="prepareReconciliation"
                        wire:loading.attr="disabled"
                        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        <span wire:loading.remove wire:target="prepareReconciliation">Review Changes</span>
                        <span wire:loading wire:target="prepareReconciliation">Processing...</span>
                    </button>
                @endif

                @if($showReconciliation)
                    <button type="button"
                        wire:click="$set('showReconciliation', false)"
                        class="ml-3 inline-flex justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        Back to Preview
                    </button>
                    <button type="submit"
                        wire:loading.attr="disabled"
                        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        <span wire:loading.remove wire:target="import">Confirm Import</span>
                        <span wire:loading wire:target="import">Importing...</span>
                    </button>
                @endif
            </x-slot:footer>
        </x-custom.form-modal>
    </div>
</section>
