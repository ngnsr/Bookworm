async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await makeLogin(email, password)
        .then(async r=>{
            if(r.ok){
                const json = await r.json();
                alert(json.message);
                window.location.href = '/books.html';
            }else{
                alert("Неправильний логін або пароль");
            }
        });
    // await update();
}

async function logout(){
    await fetch('http://localhost:3333/api/user/logout')
        .then(async r =>{
            const json = await r.json();
            alert(json.message);
            window.location.href = '/books.html';
        });
    // await update();
}

async function registration() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await makeRegistration(email, password)
        .then(async r=>{
            const json = await r.json();
            alert(json.message);
            window.location.href = '/books.html';
        });
    // await update();
}

async function update(){
    await fetch('http://localhost:3333/api/user/get-role').then(async r => {
        if (r.ok) {
            const json = await r.json();
            if(json.role === "ADMIN"){
                toggleAuthorized();
            } else{
                toggleUnauthorized();
            }
        }
    }).catch(e =>{
        toggleUnauthorized();
    });

}

function toggleAuthorized(){
    const unauthorized = document.getElementById('unauthorized');
    const authorized = document.getElementById('authorized');

    unauthorized.style.display = 'none';
    authorized.style.display = 'block';
}

function toggleUnauthorized(){
    const unauthorized = document.getElementById('unauthorized');
    const authorized = document.getElementById('authorized');

    unauthorized.style.display = 'block';
    authorized.style.display = 'none';
}

async function makeRegistration(email, password) {
    return await fetch('http://localhost:3333/api/user/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    });
}

async function makeLogin(email, password) {
    return await fetch("http://localhost:3333/api/user/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password
        })
    });
}

async function isAuthorized() {
    const response = await fetch('http://localhost:3333/api/user/auth')
    return await response.json();
}




window.onload = update;