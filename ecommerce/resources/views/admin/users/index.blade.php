@extends('layouts.admin')

@section('content') 
    <h1>Felhasználók listája</h1>

    @if($users->isEmpty())
        <p>Nincsenek felhasználók a rendszerben.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Név</th>
                    <th>Email</th>
                    <th>Regisztráció dátuma</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                    <tr>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->email }}</td>
                        <td>
                            {{ $user->created_at ? $user->created_at->format('Y-m-d H:i') : 'N/A' }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection 
