function isAdmin() {
    return fetch('http://localhost:3333/api/user/get-role')
        .then(response => {
            if (!response.ok) {
                throw new Error('Помилка запиту');
            }
            return response.json();
        })
        .then(data => {
            const role = data.role;
            if (role === 'ADMIN') {
                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
            return false;
        });
}

function toggle(){
    isAdmin()
        .then(isAdmin => {
            const adminMenuItems = document.querySelectorAll('.admin');
            adminMenuItems.forEach(adminMenuItem => {
                adminMenuItem.style.display = (isAdmin) ? 'block' : 'none';
            });
        });
}
