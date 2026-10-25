import React, { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, missingFirebaseConfig } from './firebase.js';

const pageLinks = [
  ['Home', '/index.html#home'],
  ['About Us', '/index.html#aboutus'],
  ['Contact', '/index.html#Contact'],
  ['Products', '/product.html'],
  ['Selling', '/selling.html'],
  ['Price details', '/price.html'],
  ['Cart', '/cart3.html'],
];

const socials = [
  ['Facebook', 'fa-facebook', 'https://www.facebook.com/'],
  ['Google', 'fa-google', 'https://accounts.google.com/'],
  ['Instagram', 'fa-instagram', 'https://www.instagram.com/'],
  ['Twitter', 'fa-x-twitter', 'https://x.com/'],
  ['YouTube', 'fa-youtube', 'https://www.youtube.com/'],
];

const productGroups = {
  Fruits: [
    ['Apple', 49.99, 'apple.jpg'],
    ['Banana', 44.99, 'banana.jpg'],
    ['Orange', 49.99, 'orange.jpg'],
    ['Pineapple', 29.99, 'pineapple.jpg'],
    ['Grapes', 49.99, 'grapes.jpg'],
    ['Green Grapes', 54.99, 'greengrapes.jpg'],
  ],
  Vegetables: [
    ['Tomato', 18, 'tomato.jpg'],
    ['Onion', 29.99, 'onion.jpg'],
    ['Carrot', 44.99, 'carrot.jpg'],
    ['Green Beans', 35.99, 'greenbeans.jpg'],
    ['Cabbage', 20.99, 'cabbage.jpg'],
    ['Capsicum', 44.99, 'capsicum.jpg'],
  ],
  Seeds: [
    ['Wheat', 49.99, 'wheatseeds.jpg'],
    ['Tomato Seeds', 39.99, 'tomatoseeds.jpg'],
    ['Pumpkin Seeds', 24.99, 'pumpkinseeds.jpg'],
    ['Sunflower Seeds', 24.99, 'sunflowerseeds.jpg'],
    ['Lotus Seeds', 29.99, 'lotusseeds.jpg'],
    ['Rose Seeds', 29.99, 'roseseeds.jpg'],
  ],
};

function getFirebaseErrorMessage(error) {
  if (error?.code === 'firebase/configuration-missing') {
    return `Firebase configuration is missing: ${missingFirebaseConfig.join(', ')}. Add these variables in Vercel Project Settings > Environment Variables, then redeploy. For local development, set them in Frontend/.env.local and restart Vite.`;
  }
  if (error?.code === 'permission-denied') {
    return 'Firebase denied this request. Check your Firestore rules and ensure the required Firebase service is enabled.';
  }
  if (error?.code === 'unavailable') {
    return 'Firebase is unavailable. Check your internet connection and try again.';
  }
  if (error?.code === 'checkout/timeout') {
    return 'Firebase is taking too long to confirm this order. Verify the Firebase environment variables in Vercel and check Firestore rules before retrying.';
  }
  return error?.message || 'An unexpected Firebase error occurred.';
}

function Footer() {
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Footer navigation">
        {pageLinks.map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}
        <Link to="/login.html">Login</Link>
        <Link to="/signup.html">Sign up</Link>
      </nav>
      <div className="social-icons">
        {socials.map(([name, icon, href]) => (
          <a key={name} href={href} aria-label={name} target="_blank" rel="noreferrer">
            <i className={`fa-brands ${icon}`} />
          </a>
        ))}
      </div>
      <p className="copyright">© 2026 FreshField Agriculture Market</p>
    </footer>
  );
}

function BackHome() {
  return <Link className="back-home" to="/index.html"><i className="fa-solid fa-arrow-left" /> Back to Home</Link>;
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [contactError, setContactError] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentHash = (location.hash || '#home').replace('#', '');
    const nextSection = currentHash || 'home';
    setActiveSection(nextSection);

    if (typeof document !== 'undefined') {
      const section = document.getElementById(nextSection);
      if (section) {
        requestAnimationFrame(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [location.hash, location.pathname]);

  const submitContact = async (event) => {
    event.preventDefault();
    setContactError('');
    setContactSending(true);
    const data = new FormData(event.currentTarget);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        fullName: data.get('name'),
        email: data.get('email'),
        feedback: data.get('feedback'),
        createdAt: serverTimestamp(),
      });
      navigate('/contactsuccess.html');
    } catch (error) {
      setContactError(`Could not send your message: ${getFirebaseErrorMessage(error)}`);
    } finally {
      setContactSending(false);
    }
  };

  return (
    <div className="home-page">
      <header className="main-nav">
        <Link className="brand" to="/index.html#home">
          <img src="/images/FF logo (1).jpg" alt="" />
          <span>FreshField</span>
        </Link>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
        </button>
        <nav className={menuOpen ? 'main-nav-links is-open' : 'main-nav-links'} aria-label="Main navigation">
          {[
            ['home', 'Home', '/index.html#home'],
            ['aboutus', 'About Us', '/index.html#aboutus'],
            ['Contact', 'Contact', '/index.html#Contact'],
          ].map(([id, label, to]) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={activeSection === id ? 'nav-link active' : 'nav-link'}
            >
              {label}
            </Link>
          ))}
          <Link to="/product.html" onClick={() => setMenuOpen(false)}>Product</Link>
          <Link to="/selling.html" onClick={() => setMenuOpen(false)}>Selling</Link>
          <Link to="/login.html" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/signup.html" onClick={() => setMenuOpen(false)}>Sign up</Link>
          <Link to="/price.html" onClick={() => setMenuOpen(false)}>Market prices</Link>
          <Link to="/cart3.html" onClick={() => setMenuOpen(false)}><i className="fa-solid fa-cart-shopping" /> Cart</Link>
        </nav>
      </header>

      <main>
        <section id="home" className="hero-section">
          <p className="eyebrow">From the field to your table</p>
          <h1>The way of<br />a new life</h1>
          <p className="hero-copy">Fresh produce. Fair markets. A better harvest for everyone.</p>
          <Link className="button button-light" to="/product.html">Explore products <i className="fa-solid fa-arrow-right" /></Link>
        </section>

        <section id="aboutus" className="about-section">
          <div className="section-heading">
            <p className="eyebrow">Rooted in agriculture</p>
            <h2>About FreshField</h2>
            <p>Agriculture nurtures our communities. FreshField brings growers and buyers together for food security, sustainable resource management, and a stronger local marketplace.</p>
          </div>
          <div className="about-gallery">
            {[
              ['farmer.webp', 'A farmer working in the field'],
              ['farmer1.jpg', 'Healthy crops growing on a farm'],
              ['farmer2.jpg', 'Livestock raised on a farm'],
            ].map(([src, alt]) => <div className="gallery-card" key={src}><img src={`/images/${src}`} alt={alt} /></div>)}
          </div>
        </section>

        <section id="Contact" className="contact-section">
          <form className="contact-card" onSubmit={submitContact}>
            <p className="eyebrow">We’d love to hear from you</p>
            <h2>Contact us</h2>
            <label htmlFor="contact-name">Full name</label>
            <input id="contact-name" name="name" placeholder="Your name" required />
            <label htmlFor="contact-email">Email address</label>
            <input id="contact-email" name="email" type="email" placeholder="you@example.com" required />
            <label htmlFor="contact-feedback">Your feedback</label>
            <textarea id="contact-feedback" name="feedback" rows="4" placeholder="How can we help?" required />
            {contactError && <p className="form-error" role="alert">{contactError}</p>}
            <button className="button button-green" type="submit" disabled={contactSending}>{contactSending ? 'Sending…' : 'Send message'} <i className="fa-solid fa-paper-plane" /></button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ProductLandingPage() {
  const cards = [
    ['Fruits', 'fruits.jpg'],
    ['Vegetables', 'vegetables.jpg'],
    ['Seeds', 'Seeds.jpg'],
  ];

  return (
    <div className="page-shell products-landing">
      <header className="page-top"><BackHome /></header>
      <main className="landing-content">
        <p className="eyebrow">A little goodness, grown with care</p>
        <h1>Our Products</h1>
        <div className="category-cards">
          {cards.map(([name, image]) => (
            <article className="category-card" key={name}>
              <img src={`/images/${image}`} alt={name} />
              <div><h2>{name}</h2><Link className="button button-green" to="/cart3.html">Shop {name.toLowerCase()}</Link></div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CartPage() {
  const [category, setCategory] = useState('Fruits');
  const [cart, setCart] = useState([]);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const orderDocument = useRef(null);
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (name, price, image) => {
    setCart((items) => {
      const existing = items.find((item) => item.name === name);
      return existing
        ? items.map((item) => item.name === name ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { name, price, image, quantity: 1 }];
    });
  };

  const changeQuantity = (name, amount) => {
    setCart((items) => items
      .map((item) => item.name === name ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0));
  };

  const checkout = async () => {
    if (!cart.length || checkingOut) return;
    setCheckoutError('');
    setCheckingOut(true);
    let timeoutId;
    try {
      if (missingFirebaseConfig.length) {
        const error = new Error('Firebase configuration is missing.');
        error.code = 'firebase/configuration-missing';
        throw error;
      }
      orderDocument.current ??= doc(collection(db, 'orders'));
      const saveOrder = setDoc(orderDocument.current, {
        items: cart.map(({ name, price, quantity }) => ({ name, price, quantity })),
        total,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      await Promise.race([
        saveOrder,
        new Promise((_, reject) => {
          timeoutId = window.setTimeout(() => {
            const error = new Error('Order confirmation timed out.');
            error.code = 'checkout/timeout';
            reject(error);
          }, 20000);
        }),
      ]);
      orderDocument.current = null;
      setCart([]);
      navigate('/thankyou.html');
    } catch (error) {
      setCheckoutError(`Could not place your order: ${getFirebaseErrorMessage(error)}`);
    } finally {
      window.clearTimeout(timeoutId);
      setCheckingOut(false);
    }
  };

  return (
    <div className="market-page">
      <div className="market-top"><BackHome /><Link className="button button-outline" to="/price.html">See market prices</Link></div>
      <nav className="category-tabs" aria-label="Product categories">
        {Object.keys(productGroups).map((name) => (
          <button className={category === name ? 'tab-button active' : 'tab-button'} type="button" key={name} onClick={() => setCategory(name)}>{name}</button>
        ))}
        <button className="tab-button tab-dark" type="button" onClick={() => document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' })}>View cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
      </nav>
      <main className="market-content">
        <p className="eyebrow">{category === 'Fruits' ? 'Picked fresh' : category === 'Vegetables' ? 'Goodness from the garden' : 'Start your next harvest'}</p>
        <h1>{category === 'Fruits' ? 'Fresh Fruits' : category === 'Vegetables' ? 'Organic Vegetables' : 'Quality Seeds'}</h1>
        <div className="product-grid">
          {productGroups[category].map(([name, price, image]) => (
            <article className="market-product" key={name}>
              <img src={`/images/${image}`} alt={name} />
              <div className="market-product-info"><h2>{name}</h2><p>₹{price.toFixed(2)}</p></div>
              <button className="button button-green add-button" type="button" onClick={() => addToCart(name, price, image)}>Add to cart <i className="fa-solid fa-plus" /></button>
            </article>
          ))}
        </div>

        <section id="cart-section" className="cart-panel">
          <div className="cart-heading"><div><p className="eyebrow">Your selection</p><h2><i className="fa-solid fa-basket-shopping" /> Shopping cart</h2></div><span>{cart.length} {cart.length === 1 ? 'item' : 'items'}</span></div>
          {cart.length === 0 ? <p className="empty-cart">Your cart is empty. Add something fresh to get started.</p> : (
            <div className="cart-table-wrap">
              <table className="cart-table">
                <thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.name}>
                      <td className="cart-product-name"><img src={`/images/${item.image}`} alt="" />{item.name}</td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td><div className="quantity-control"><button type="button" aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item.name, -1)}>−</button><span>{item.quantity}</span><button type="button" aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item.name, 1)}>+</button></div></td>
                      <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                      <td><button className="remove-button" type="button" aria-label={`Remove ${item.name}`} onClick={() => setCart((items) => items.filter((product) => product.name !== item.name))}><i className="fa-regular fa-trash-can" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {checkoutError && <p className="form-error" role="alert">{checkoutError}</p>}
          <div className="cart-total"><p>Grand total <strong>₹{total.toFixed(2)}</strong></p><button className="button button-green" type="button" disabled={!cart.length || checkingOut} onClick={checkout}>{checkingOut ? 'Placing order…' : 'Proceed to checkout'} <i className="fa-solid fa-arrow-right" /></button></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const marketRates = {
  Vegetables: [
    ['Tomato', '28', '32 - 36', '1 kg'], ['Onion', '34', '40 - 45', '1 kg'], ['Carrot', '48', '55 - 60', '1 kg'],
    ['Green Beans', '38', '42 - 48', '1 kg'], ['Cabbage', '22', '28 - 32', '1 kg'], ['Capsicum', '45', '52 - 58', '1 kg'],
  ],
  Fruits: [
    ['Apple (Shimla)', '170', '190 - 210', '1 kg'], ['Banana', '35', '45 - 50', '1 kg'], ['Orange', '85', '95 - 110', '1 kg'],
    ['Pineapple', '65', '75 - 85', '1 kg'], ['Grapes (Black)', '110', '130 - 150', '1 kg'], ['Green Grapes', '90', '110 - 120', '1 kg'],
  ],
  Seeds: [
    ['Wheat Seeds', '26', '30 - 35', '1 kg'], ['Tomato Seeds', '450', '550 - 600', '100 g'], ['Pumpkin Seeds', '180', '220 - 250', '1 kg'],
    ['Sunflower Seeds', '75', '90 - 110', '1 kg'], ['Lotus Seeds', '320', '380 - 450', '1 kg'], ['Rose Seeds', '120', '150 - 180', 'Packet'],
  ],
};

function PricePage() {
  const [active, setActive] = useState('Vegetables');
  return (
    <div className="page-shell price-page">
      <header className="page-top"><BackHome /></header>
      <main className="price-content">
        <p className="eyebrow">Puducherry · 2026</p>
        <h1>Products Market Rates</h1>
        <p className="page-intro">Compare wholesale and retail prices across popular produce and seeds.</p>
        <div className="price-tabs" role="tablist" aria-label="Price categories">
          {Object.keys(marketRates).map((name) => <button key={name} role="tab" aria-selected={active === name} className={active === name ? 'tab-button active' : 'tab-button'} type="button" onClick={() => setActive(name)}>{name}</button>)}
        </div>
        <div className="price-table-wrap">
          <table className="price-table">
            <thead><tr><th>Item</th><th>Wholesale (₹)</th><th>Retail (₹)</th><th>Unit</th></tr></thead>
            <tbody>{marketRates[active].map(([item, wholesale, retail, unit]) => <tr key={item}><td>{item}</td><td>{wholesale}</td><td>{retail}</td><td>{unit}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="rate-note">Prices are indicative and may vary by season and local market.</p>
      </main>
      <Footer />
    </div>
  );
}

function AuthPage({ signup = false }) {
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (signup && data.get('password') !== data.get('confirm_password')) {
      event.currentTarget.elements.confirm_password.setCustomValidity('Passwords do not match.');
      event.currentTarget.reportValidity();
      return;
    }
    navigate(signup ? '/signupsuccess.html' : '/loginsuccess.html');
  };
  const clearPasswordError = (event) => event.currentTarget.setCustomValidity('');

  return (
    <div className={`auth-page ${signup ? 'signup-page' : 'login-page'}`}>
      <BackHome />
      <main className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <p className="eyebrow">{signup ? 'Join the community' : 'Welcome back'}</p>
          <h1>{signup ? 'Create your account' : 'Login'}</h1>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" autoComplete="username" required />
          {!signup && <><label htmlFor="email">Email address</label><input id="email" type="email" name="email" autoComplete="email" required /></>}
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" autoComplete={signup ? 'new-password' : 'current-password'} required />
          {signup && <><label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" name="confirm_password" autoComplete="new-password" required onChange={clearPasswordError} /></>}
          {!signup && <p className="auth-switch">New to FreshField? <Link to="/signup.html">Create an account</Link></p>}
          <button className="button button-green auth-submit" type="submit">{signup ? 'Sign up' : 'Login'} <i className="fa-solid fa-arrow-right" /></button>
          {signup && <p className="auth-switch">Already have an account? <Link to="/login.html">Login</Link></p>}
        </form>
      </main>
      <Footer />
    </div>
  );
}

function SellingPage() {
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    navigate('/sellingupdate.html');
  };

  return (
    <div className="seller-page">
      <BackHome />
      <main className="seller-main">
        <form className="seller-card" onSubmit={submit}>
          <p className="eyebrow">Grow your market</p><h1>List a product</h1>
          <label htmlFor="seller-name">Full name</label><input id="seller-name" name="name" placeholder="Enter your name" required />
          <fieldset><legend>I am a</legend><div className="radio-options">{['Buyer', 'Seller', 'Both'].map((item) => <label key={item}><input type="radio" name="identity" value={item} required /> {item}</label>)}</div></fieldset>
          <fieldset><legend>Gender</legend><div className="radio-options">{['Male', 'Female', 'Others'].map((item) => <label key={item}><input type="radio" name="gender" value={item} required /> {item}</label>)}</div></fieldset>
          <label htmlFor="product-name">Product name</label><input id="product-name" name="product_name" placeholder="What are you selling?" required />
          <label htmlFor="product-image">Product image</label><input id="product-image" type="file" name="file" accept="image/*" required />
          <button className="button button-green" type="submit">List product now <i className="fa-solid fa-arrow-right" /></button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

function SuccessPage({ type }) {
  const details = {
    login: ['Login successful!', 'Welcome back to FreshField Agriculture Market.', 'Go to dashboard', 'fa-circle-check'],
    signup: ['Signup successful!', 'Your account has been created successfully. You can now log in to access your dashboard.', 'Go to home', 'fa-circle-check'],
    selling: ['Product listed!', 'Your product listing was submitted successfully.', 'Go to home', 'fa-circle-check'],
    contact: ['Message received!', 'Your inquiry has been sent to the FreshField team. We usually respond within 24 hours.', 'Back to home', 'fa-paper-plane'],
    order: ['Order successful!', 'Thank you for your order. Your fresh produce is being prepared.', 'Go to home', 'fa-basket-shopping'],
  }[type];
  return (
    <main className={`success-page success-${type}`}>
      {type === 'contact' && <BackHome />}
      <section className="success-card">
        <div className="success-icon"><i className={`fa-solid ${details[3]}`} /></div>
        <p className="eyebrow">{type === 'order' ? 'Thank you for your order' : 'FreshField Agriculture Market'}</p>
        <h1>{details[0]}</h1>
        <p>{details[1]}</p>
        {type !== 'contact' && <Link className="button button-green" to="/index.html">{details[2]} <i className="fa-solid fa-arrow-right" /></Link>}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/index.html" element={<HomePage />} />
      <Route path="/product.html" element={<ProductLandingPage />} />
      <Route path="/cart3.html" element={<CartPage />} />
      <Route path="/price.html" element={<PricePage />} />
      <Route path="/login.html" element={<AuthPage />} />
      <Route path="/signup.html" element={<AuthPage signup />} />
      <Route path="/selling.html" element={<SellingPage />} />
      <Route path="/loginsuccess.html" element={<SuccessPage type="login" />} />
      <Route path="/signupsuccess.html" element={<SuccessPage type="signup" />} />
      <Route path="/sellingupdate.html" element={<SuccessPage type="selling" />} />
      <Route path="/contactsuccess.html" element={<SuccessPage type="contact" />} />
      <Route path="/thankyou.html" element={<SuccessPage type="order" />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
