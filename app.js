const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Set up view engine to render EJS templates
app.set('view engine', 'ejs');
app.set('views', './views'); // Ensure views directory is in the correct path

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'ecommerce-secret',
  resave: false,
  saveUninitialized: true,
}));

// Mock user database and products
const users = [];
const products = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: (i + 1) * 50,
}));

// User cart
const carts = {};

// Routes

// Home page route
app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect if user is not logged in
  }
  const cart = carts[req.session.user.username] || [];
  res.render('index', { products, user: req.session.user, cart });
});

// Register route
app.get('/register', (req, res) => res.render('register'));
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send('Please fill all fields.');
  }
  users.push({ username, password });
  carts[username] = []; // Initialize an empty cart for the new user
  res.redirect('/login');
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
}); 

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    return res.redirect('/');
  }
  res.send('Invalid credentials');
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Add to Cart route
app.post('/cart/add', (req, res) => {
  const productId = req.body.productId;
  const username = req.session.user.username;

  if (!carts[username]) {
    carts[username] = [];
  }

  const product = products.find(p => p.id === parseInt(productId));
  if (product) {
    carts[username].push(product);
  }

  res.redirect('/cart'); // Redirect to the cart page
});

// View Cart route
app.get('/cart', (req, res) => {
  const cart = carts[req.session.user.username] || [];
  res.render('cart', { cart, user: req.session.user });
});

// Checkout route (GET request)
app.get('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect if not logged in
  }

  const username = req.session.user.username;
  const cart = carts[username] || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  res.render('checkout', { cart, total });
});

// Payment processing (POST request)
app.post('/process-payment', (req, res) => {
  const { cardNumber, expiryDate, cvv } = req.body;
  const username = req.session.user?.username;

  if (!username) {
    return res.redirect('/login');
  }

  const cart = carts[username];

  if (!cart || cart.length === 0) {
    return res.status(400).send("Your cart is empty.");
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  console.log(`Processing payment for ${username} - Card: ${cardNumber}, Total: $${total}`);

  carts[username] = []; // Clear the cart after processing payment

  res.redirect('/order-confirmation');
});

// Order Confirmation route (GET request)
app.get('/order-confirmation', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  const cart = carts[req.session.user.username] || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  res.render('order-confirmation', { total });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
