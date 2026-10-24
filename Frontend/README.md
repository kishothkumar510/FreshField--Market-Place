# FreshField React frontend

This folder contains the React/Vite version of the FreshField agriculture marketplace.
The original HTML files in the parent folder are left unchanged.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Production build

```sh
npm run build
npm run preview
```

The original page URLs are available as React routes, including `/index.html`,
`/product.html`, `/cart3.html`, `/price.html`, `/login.html`, `/signup.html`,
`/selling.html`, and their confirmation pages. Marketplace images are in
`public/images`.

Login, signup, contact, and listing forms demonstrate the original page flow;
they do not submit data to a backend. Cart changes are held in browser memory
until the cart page is left.
