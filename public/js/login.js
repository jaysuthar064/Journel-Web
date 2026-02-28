document.addEventListener('DOMContentLoaded', () => {
    const loginPasswordInput = document.getElementById('loginPassword');
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const icon = toggleLoginPassword.querySelector('i');

    toggleLoginPassword.addEventListener('click', () => {
        const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        loginPasswordInput.setAttribute('type', type);
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
    });
});
