<form id="loginForm">
    @csrf
    <label for="email">Email:</label>
    <input type="email" name="email" id="email" required>
    
    <label for="password">Password:</label>
    <input type="password" name="password" id="password" required>
    
    <button type="submit">Login</button>
</form>

@if($errors->any())
    <div>
        <strong>{{ $errors->first() }}</strong>
    </div>
@endif

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    document.getElementById('loginForm').onsubmit = function(event) {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        axios.post('http://127.0.0.1:8000/login', {
            email: email,
            password: password,
        })
        .then(response => {
            console.log('Bejelentkezés sikeres:', response.data);
            localStorage.setItem('token', response.data.token); 
            window.location.href = '/'; 
        })
        .catch(error => {
            
            console.error('Hiba a bejelentkezés során:', error);
            alert('Bejelentkezési hiba: ' + (error.response ? error.response.data.error : 'Ismeretlen hiba'));
        });
    };
</script>
