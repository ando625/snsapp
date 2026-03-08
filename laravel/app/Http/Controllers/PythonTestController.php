<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PythonTestController extends Controller
{
    public function test()
    {
        $scriptPath = base_path('python/test.py');

        $output = shell_exec("python3 $scriptPath");

        return response()->json([
            'message' => 'LaravelからPythonを呼び出しました',
            'python_outout' => $output
        ]);
    }
}
