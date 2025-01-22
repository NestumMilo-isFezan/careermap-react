<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    protected $table = 'curriculums';
    protected $fillable = ['name', 'description', 'student_id', 'document', 'status', 'level', 'type'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function saveFile($file)
    {
        $this->document = $file->store('curriculums', 'public');
        $this->save();
    }
}
