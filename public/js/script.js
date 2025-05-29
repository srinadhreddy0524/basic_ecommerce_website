function filterProducts() {
    const query = document.getElementById('search').value.toLowerCase();
    const products = document.querySelectorAll('.card');
    products.forEach(product => {
      const productName = product.querySelector('h2').textContent.toLowerCase();
      product.style.display = productName.includes(query) ? 'block' : 'none';
    });
  }
// Session middleware
const session = require('express-session');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

  // script.js
document.addEventListener('DOMContentLoaded', function () {
  // Example of a basic form validation (if needed)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
      form.addEventListener('submit', (event) => {
          let isValid = true;
          form.querySelectorAll('input').forEach(input => {
              if (input.value === '') {
                  isValid = false;
                  input.style.borderColor = 'red';
              } else {
                  input.style.borderColor = '';
              }
          });
          if (!isValid) {
              event.preventDefault();
          }
      });
  });
});
