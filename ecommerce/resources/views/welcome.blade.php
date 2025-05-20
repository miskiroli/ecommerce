<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

      
    </head>
    <body>
        <div id="app">

        </div>
        <script>
        window.env = {
            REACT_APP_API_URL: "{{ env('REACT_APP_API_URL') }}",
            REACT_APP_STORAGE_URL: "{{ env('REACT_APP_STORAGE_URL') }}"
        };
    </script>
        <script src="{{ mix('/js/app.js') }}"></script>
    </body>
  
</html>
