<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Represents a task in the system.
 */
class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that can be mass assigned.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
    ];
}