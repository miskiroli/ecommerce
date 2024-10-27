@extends('layouts.admin')

@section('content')
    <h1>Termék szerkesztése</h1>

    <form action="{{ route('admin.products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label for="name">Termék neve:</label>
            <input type="text" class="form-control" id="name" name="name" value="{{ $product->name }}" required>
        </div>

        <div class="form-group">
            <label for="price">Ár (Ft):</label>
            <input type="number" class="form-control" id="price" name="price" value="{{ $product->price }}" required>
        </div>

        <div class="form-group">
            <label for="stock">Raktárkészlet:</label>
            <input type="number" class="form-control" id="stock" name="stock" value="{{ $product->stock }}" required>
        </div>

        <div class="form-group">
            <label for="description">Leírás:</label>
            <textarea class="form-control" id="description" name="description" rows="4" required>{{ $product->description }}</textarea>
        </div>

        <div class="form-group">
            <label for="category">Kategória:</label>
            <select name="category_id" id="category" class="form-control" required>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}" {{ $product->category_id == $category->id ? 'selected' : '' }}>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label for="images">Jelenlegi képek:</label>
            @if($product->images)
                @foreach(json_decode($product->images, true) as $image)
                    <div style="margin-bottom: 10px;">
                        <img src="{{ asset('storage/' . $image) }}" alt="Termék kép" style="max-width: 150px; margin-right: 10px;">
                        <label>
                            <input type="checkbox" name="remove_images[]" value="{{ $image }}">
                            Kép törlése
                        </label>
                    </div>
                @endforeach
            @else
                <p>Nincs feltöltött kép.</p>
            @endif
        </div>
        
        <div class="form-group">
            <label for="images">Új képek feltöltése:</label>
            <input type="file" class="form-control" id="images" name="images[]" multiple accept="image/*">
        </div>
        

        <div class="form-group">
            <img id="imagePreview" src="#" alt="Kép előnézete" style="display:none; max-width: 300px; margin-top: 10px;">
        </div>

        <button type="submit" class="btn btn-primary">Mentés</button>
    </form>

    <script>
        function previewImage(event) {
            const imagePreview = document.getElementById('imagePreview');
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = '#';
                imagePreview.style.display = 'none';
            }
        }
    </script>
@endsection
