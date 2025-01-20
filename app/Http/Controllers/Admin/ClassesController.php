<?php

namespace App\Http\Controllers\Admin;

use App\Models\Classroom;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ClassesController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Classroom::create([
            'name' => $validated['name'],
            'school_id' => 1,
        ]);

        return redirect()->route('admin.school.index')->with('success', 'Classroom created successfully');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Classroom::find($id)->update($validated);

        return redirect()->route('admin.school.index')->with('edit_success', 'Classroom updated successfully');
    }

    public function destroy($id)
    {
        Classroom::find($id)->delete();

        return redirect()->route('admin.school.index')->with('delete_success', 'Classroom deleted successfully');
    }
}
