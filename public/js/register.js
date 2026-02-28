document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn');
    const strengthBar = document.getElementById('strengthBar');
    const passwordStrengthContainer = document.getElementById('passwordStrength');
    
    // Password Visibility Toggler
    const setupPasswordToggle = (inputId, toggleId) => {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        const icon = toggle.querySelector('i');
        
        toggle.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            icon.classList.toggle('bi-eye');
            icon.classList.toggle('bi-eye-slash');
        });
    };
    
    setupPasswordToggle('password', 'togglePassword');
    setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');

    // Complex Password Strength Meter Algorithm
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        if (val.length > 0) {
            passwordStrengthContainer.style.display = 'block';
            let strength = 0;
            
            if (val.length > 5) strength += 20;
            if (val.length > 8) strength += 10;
            if (val.match(/[a-z]+/)) strength += 15;
            if (val.match(/[A-Z]+/)) strength += 20;
            if (val.match(/[0-9]+/)) strength += 15;
            if (val.match(/[\W]+/)) strength += 20;

            strength = Math.min(strength, 100);
            strengthBar.style.width = strength + '%';
            
            if (strength < 40) {
                strengthBar.style.backgroundColor = '#ef4444'; // Red - Weak
            } else if (strength < 70) {
                strengthBar.style.backgroundColor = '#f59e0b'; // Amber - Fair
            } else if (strength < 90) {
                strengthBar.style.backgroundColor = '#3b82f6'; // Blue - Good
            } else {
                strengthBar.style.backgroundColor = '#10b981'; // Green - Strong
            }
        } else {
            passwordStrengthContainer.style.display = 'none';
        }
        
        // If confirm password has value, recheck match on main password change
        if(confirmPasswordInput.value) {
            checkPasswordMatch();
        }
    });

    // Validation Utilities
    const showError = (input, errorElementId, show) => {
        const errorElement = document.getElementById(errorElementId);
        if (show) {
            input.classList.add('is-invalid');
            errorElement.style.display = 'block';
        } else {
            input.classList.remove('is-invalid');
            errorElement.style.display = 'none';
        }
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(emailInput.value);
        showError(emailInput, 'emailError', emailInput.value !== '' && !isValid);
        return isValid;
    };

    const validatePasswordLength = () => {
        const isValid = passwordInput.value.length >= 6;
        showError(passwordInput, 'passwordError', passwordInput.value !== '' && !isValid);
        return isValid;
    };

    const checkPasswordMatch = () => {
        const isValid = passwordInput.value === confirmPasswordInput.value && confirmPasswordInput.value !== '';
        showError(confirmPasswordInput, 'confirmPasswordError', confirmPasswordInput.value !== '' && !isValid);
        return isValid;
    };

    // Event Listeners for real-time validation
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('is-invalid')) validateEmail();
    });
    
    passwordInput.addEventListener('blur', validatePasswordLength);
    passwordInput.addEventListener('input', () => {
        if (passwordInput.classList.contains('is-invalid')) validatePasswordLength();
    });

    confirmPasswordInput.addEventListener('input', checkPasswordMatch);

    // Form Submit Interception
    form.addEventListener('submit', (e) => {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePasswordLength();
        const isMatchValid = checkPasswordMatch();

        // Force show errors if empty
        if (!emailInput.value) showError(emailInput, 'emailError', true);
        if (!passwordInput.value) showError(passwordInput, 'passwordError', true);
        if (!confirmPasswordInput.value) showError(confirmPasswordInput, 'confirmPasswordError', true);
        
        if (!isEmailValid || !isPasswordValid || !isMatchValid || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
            e.preventDefault();
            
            // Trigger invalid shake animation
            const card = document.querySelector('.auth-card');
            card.style.animation = 'none';
            // Trigger reflow
            card.offsetHeight;
            card.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
            return;
        }

        // Show loading state and prevent multiple clicks
        submitBtn.classList.add('loading');
    });
    
    // Inject shake animation keyframes dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0); }
            20%, 80% { transform: translate3d(3px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-5px, 0, 0); }
            40%, 60% { transform: translate3d(5px, 0, 0); }
        }
    `;
    document.head.appendChild(style);
});
