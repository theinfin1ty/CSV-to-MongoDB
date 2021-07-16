 // Example starter JavaScript for disabling form submissions if there are invalid fields
 (function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
        })
    })()


var check = function() {
    if (document.getElementById('password').value ==
        document.getElementById('confirm-password').value) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = 'Perfect!';
    } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Passwords not matching!';
    }
    }