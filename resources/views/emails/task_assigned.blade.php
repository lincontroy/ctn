<!DOCTYPE html>
<html>
<head>
    <title>Task Assigned</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
    <h2>Hello {{ $user->name }},</h2>

    <p>You have been assigned a new task. Here are the details:</p>

    <table style="border-collapse: collapse; margin-top: 20px;">
        <tr>
            <td style="font-weight: bold; padding: 5px;">📋 Title:</td>
            <td style="padding: 5px;">{{ $task->title }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; padding: 5px;">📝 Description:</td>
            <td style="padding: 5px;">{{ $task->description }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; padding: 5px;">📅 Deadline:</td>
            <td style="padding: 5px;">{{ \Carbon\Carbon::parse($task->deadline)->format('F j, Y') }}</td>
        </tr>
    </table>

    <p style="margin-top: 20px;">Please log into the task system to manage your task.</p>

    <p>— Your Team</p>
</body>
</html>
