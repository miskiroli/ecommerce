@extends('layouts.admin')

@section('content')
    <h1>Termékek kezelése</h1>

    <!-- Új termék hozzáadása gomb -->
    <a href="{{ route('admin.products.create') }}" class="btn btn-primary">Új termék hozzáadása</a>

    <!-- Üzenetek megjelenítése, pl. sikeres törlés, szerkesztés stb. -->
    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <!-- Termékek listája táblázatban -->
    <table class="table">
        <thead>
            <tr>
                <th>Név</th>
                <th>Ár</th>
                <th>Kategória</th>
                <th>Akciók</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $product)
                <tr>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->price }} Ft</td>
                    <td>{{ $product->category->name }}</td>
                    <td>
                        <!-- Szerkesztés -->
                        <a href="{{ route('admin.products.edit', $product->id) }}" class="btn btn-sm btn-warning">Szerkesztés</a>

                        <!-- Törlés -->
                        <form action="{{ route('admin.products.destroy', $product->id) }}" method="POST" style="display: inline-block;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Biztosan törölni szeretnéd?')">Törlés</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
