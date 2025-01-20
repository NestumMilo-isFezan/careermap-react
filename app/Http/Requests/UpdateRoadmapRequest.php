<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoadmapRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'domain_id' => 'required|exists:domains,id',
            'prerequisite_items' => 'required|array|min:1',
            'prerequisite_items.*.subject_id' => 'required|exists:subjects,id',
            'prerequisite_items.*.requirement' => 'required|in:A+,A,A-,B+,B,C+,C,D,E,F',
            'adaptation_items' => 'required|array|min:1',
            'adaptation_items.*.persona_id' => 'required|exists:personas,id',
            'adaptation_items.*.name' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'A roadmap title is required',
            'title.max' => 'Title cannot be more than :max characters',
            'description.required' => 'Please provide a roadmap description',
            'image.required' => 'A roadmap image is required',
            'image.image' => 'The file must be an image',
            'domain_id.required' => 'Please select a domain',
            'domain_id.exists' => 'The selected domain is invalid',

            // For prerequisite items
            'prerequisite_items.required' => 'At least one prerequisite is required',
            'prerequisite_items.min' => 'At least one prerequisite is required',
            'prerequisite_items.*.subject_id.required' => 'Please select a subject for prerequisite :position',
            'prerequisite_items.*.subject_id.exists' => 'Invalid subject selected for prerequisite :position',
            'prerequisite_items.*.requirement.required' => 'Please select a grade requirement for prerequisite :position',
            'prerequisite_items.*.requirement.in' => 'Invalid grade requirement for prerequisite :position',

            // For adaptation items
            'adaptation_items.required' => 'At least one persona is required',
            'adaptation_items.min' => 'At least one persona is required',
            'adaptation_items.*.persona_id.required' => 'Please select a persona for item :position',
            'adaptation_items.*.persona_id.exists' => 'Invalid persona selected for item :position',
            'adaptation_items.*.name.required' => 'Please provide a name for item :position',
        ];
    }

    // Optional: Customize the attribute names
    public function attributes()
    {
        return [
            'title' => 'roadmap title',
            'description' => 'roadmap description',
            'domain_id' => 'domain',
            'prerequisite_items.*.subject_id' => 'subject',
            'prerequisite_items.*.requirement' => 'grade requirement',
            'adaptation_items.*.persona_id' => 'persona'
        ];
    }
}
