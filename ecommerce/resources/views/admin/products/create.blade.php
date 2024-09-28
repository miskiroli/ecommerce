@extends('layouts.admin')

@section('content')
    <h1>Új termék hozzáadása</h1>

    <form action="{{ route('admin.products.store') }}" method="POST">
        @csrf

        <div class="form-group">
            <label for="name">Termék neve:</label>
            <input type="text" class="form-control" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="price">Ár (Ft):</label>
            <input type="number" class="form-control" id="price" name="price" required>
        </div>

        <div class="form-group">
            <label for="category">Kategória:</label>
            <select name="category_id" id="category" class="form-control" required>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                @endforeach
            </select>
        </div>

        <button type="submit" class="btn btn-primary">Mentés</button>
    </form>
@endsection
