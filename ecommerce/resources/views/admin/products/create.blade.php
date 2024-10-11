@extends('layouts.admin')

@section('content')
    <h1>Új termék hozzáadása</h1>

    <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data">
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
            <label for="description">Leírás:</label>
            <textarea class="form-control" id="description" name="description" rows="4" required></textarea>
        </div>

        <div class="form-group">
            <label for="category">Kategória:</label>
            <select name="category_id" id="category" class="form-control" required>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                @endforeach
            </select>
        </div>

      <div class="form-group">
    <label for="image1">1. Kép feltöltése:</label>
    <input type="file" class="form-control" id="image1" name="images[]" accept="image/*">
</div>

<div class="form-group">
    <label for="image2">2. Kép feltöltése:</label>
    <input type="file" class="form-control" id="image2" name="images[]" accept="image/*">
</div>

<div class="form-group">
    <label for="image3">3. Kép feltöltése:</label>
    <input type="file" class="form-control" id="image3" name="images[]" accept="image/*">
</div>

<div class="form-group">
    <label for="image4">4. Kép feltöltése:</label>
    <input type="file" class="form-control" id="image4" name="images[]" accept="image/*">
</div>


        <div class="form-group">
            <div id="imagePreviews" style="display: flex; flex-wrap: wrap;"></div>
        </div>

        <button type="submit" class="btn btn-primary">Mentés</button>
    </form>

    <script>
        function previewImages(event) {
            const imagePreviews = document.getElementById('imagePreviews');
            imagePreviews.innerHTML = ''; 

            const files = event.target.files;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100px'; 
                    img.style.margin = '5px'; 
                    imagePreviews.appendChild(img);
                }

                reader.readAsDataURL(file);
            }
        }
    </script>
@endsection
