// Moteur applicatif principal, gestion globale du panier, favoris, utilisateur et routage d'URL

const App = {
  // État local de la session
  cart: [],
  favorites: [],
  currentUser: null,

  init: function() {
    // Restaurer les états du localStorage
    this.cart = JSON.parse(localStorage.getItem("oceanashop_cart") || "[]");
    this.favorites = JSON.parse(localStorage.getItem("oceanashop_favorites") || "[]");
    this.currentUser = JSON.parse(localStorage.getItem("oceanashop_current_user") || "null");

    this.updateBadges();
    this.bindGlobalEvents();

    // Écouter les changements d'ancre (Hash)
    window.addEventListener("hashchange", () => this.route());
    
    // Premier routage au chargement
    this.route();
  },

  // Routage dynamique basé sur le hash de l'URL
  route: function() {
    const hash = window.location.hash || "#home";
    const path = hash.split("?")[0];
    const params = this.getQueryParams();

    const appNode = document.getElementById("app");
    
    // Fermer le menu mobile et le tiroir panier lors d'une navigation
    this.closeMobileMenu();
    this.closeCartDrawer();

    // Activer le lien correspondant dans le menu de navigation
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.remove("active");
    });
    
    let htmlContent = "";

    switch (path) {
      case "#home":
        htmlContent = window.HomePage.render();
        appNode.innerHTML = htmlContent;
        window.HomePage.init();
        document.getElementById("nav-home")?.classList.add("active");
        break;
      case "#shop":
        htmlContent = window.ShopPage.render(params);
        appNode.innerHTML = htmlContent;
        window.ShopPage.init();
        if (params.cat === 'sacs-a-main') {
          document.getElementById("nav-handbags")?.classList.add("active");
        } else if (params.cat === 'sacs-bandouliere') {
          document.getElementById("nav-shoulder")?.classList.add("active");
        } else if (params.promo === 'true') {
          document.getElementById("nav-promos")?.classList.add("active");
        } else {
          document.getElementById("nav-shop")?.classList.add("active");
        }
        break;
      case "#product":
        htmlContent = window.ProductPage.render(params);
        appNode.innerHTML = htmlContent;
        window.ProductPage.init(params);
        break;
      case "#account":
        htmlContent = window.AccountPage.render();
        appNode.innerHTML = htmlContent;
        window.AccountPage.init();
        break;
      case "#favorites":
        // Utiliser la vue account redirigée ou une section dédiée
        htmlContent = window.AccountPage.render();
        appNode.innerHTML = htmlContent;
        window.AccountPage.init();
        break;
      case "#checkout":
        // Réinitialiser l'état du checkout pour chaque nouvelle session d'achat
        window.CheckoutPage.reset();
        htmlContent = window.CheckoutPage.render();
        appNode.innerHTML = htmlContent;
        window.CheckoutPage.init();
        break;
      case "#order-tracking":
        htmlContent = window.OrderTrackingPage.render(params);
        appNode.innerHTML = htmlContent;
        window.OrderTrackingPage.init();
        break;
      case "#admin":
        htmlContent = window.AdminPage.render();
        appNode.innerHTML = htmlContent;
        window.AdminPage.init();
        break;
      case "#about":
        htmlContent = window.InfoPages.renderAbout();
        appNode.innerHTML = htmlContent;
        document.getElementById("nav-about")?.classList.add("active");
        break;
      case "#shipping-policy":
        htmlContent = window.InfoPages.renderShippingPolicy();
        appNode.innerHTML = htmlContent;
        break;
      case "#return-policy":
        htmlContent = window.InfoPages.renderReturnPolicy();
        appNode.innerHTML = htmlContent;
        break;
      case "#terms":
        htmlContent = window.InfoPages.renderTerms();
        appNode.innerHTML = htmlContent;
        break;
      case "#contact":
        htmlContent = window.InfoPages.renderContact();
        appNode.innerHTML = htmlContent;
        window.InfoPages.initContact();
        document.getElementById("nav-contact")?.classList.add("active");
        break;
      default:
        htmlContent = `
          <div class="container" style="padding: 100px 20px; text-align: center;">
            <h2>Page Non Trouvée (404)</h2>
            <p>La page recherchée n'existe pas ou a été déplacée.</p>
            <a href="#home" class="btn btn-primary" style="margin-top: 20px;">Retour à l'accueil</a>
          </div>
        `;
        appNode.innerHTML = htmlContent;
    }

    // Remonter la page en haut lors d'un changement de vue
    window.scrollTo(0, 0);
  },

  // Helper pour extraire les paramètres de requêtes (ex: #product?id=2)
  getQueryParams: function() {
    const hash = window.location.hash;
    const qStr = hash.split("?")[1];
    if (!qStr) return {};

    const pairs = qStr.split("&");
    const params = {};
    pairs.forEach(p => {
      const parts = p.split("=");
      params[parts[0]] = decodeURIComponent(parts[1] || "");
    });
    return params;
  },

  // Gestion des événements globaux (Header, Panier tiroir, etc.)
  bindGlobalEvents: function() {
    // Toggle Menu Mobile
    const mobileToggle = document.getElementById("btn-mobile-toggle");
    const navMenu = document.getElementById("nav-menu");
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
      });
    }

    // Toggle Panier Tiroir
    const cartToggle = document.getElementById("btn-cart-toggle");
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("drawer-overlay");
    const drawerClose = document.getElementById("btn-drawer-close");
    const drawerCheckout = document.getElementById("btn-drawer-checkout");

    if (cartToggle && drawer && overlay) {
      cartToggle.addEventListener("click", () => {
        this.openCartDrawer();
      });
    }

    if (drawerClose && overlay) {
      drawerClose.addEventListener("click", () => this.closeCartDrawer());
      overlay.addEventListener("click", () => this.closeCartDrawer());
    }

    if (drawerCheckout) {
      drawerCheckout.addEventListener("click", () => {
        this.closeCartDrawer();
        window.location.hash = "#checkout";
      });
    }

    // Formulaire d'inscription newsletter du footer
    const footerNewsletter = document.getElementById("newsletter-form-footer");
    if (footerNewsletter) {
      footerNewsletter.addEventListener("submit", (e) => {
        e.preventDefault();
        this.showToast("Inscription à la newsletter OcéanaShop enregistrée !");
        footerNewsletter.reset();
      });
    }
  },

  // Fermer le menu de navigation mobile
  closeMobileMenu: function() {
    document.getElementById("nav-menu")?.classList.remove("active");
  },

  // Ouvrir le tiroir panier
  openCartDrawer: function() {
    document.getElementById("cart-drawer")?.classList.add("open");
    document.getElementById("drawer-overlay")?.classList.add("open");
    this.renderCartDrawerItems();
  },

  // Fermer le tiroir panier
  closeCartDrawer: function() {
    document.getElementById("cart-drawer")?.classList.remove("open");
    document.getElementById("drawer-overlay")?.classList.remove("open");
  },

  // Rendu des articles dans le tiroir panier
  renderCartDrawerItems: function() {
    const itemsNode = document.getElementById("drawer-cart-items");
    const subtotalNode = document.getElementById("drawer-subtotal");
    const totalNode = document.getElementById("drawer-total");

    if (!itemsNode) return;

    if (this.cart.length === 0) {
      itemsNode.innerHTML = `
        <div style="text-align: center; padding: 40px 0; color: var(--text-gray);">
          <i class="fa-solid fa-bag-shopping" style="font-size: 32px; color: var(--text-light); margin-bottom: 10px;"></i>
          <p>Votre panier est vide.</p>
        </div>
      `;
      subtotalNode.textContent = "0 FCFA";
      totalNode.textContent = "0 FCFA";
      return;
    }

    let itemsHTML = this.cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-price">${item.price.toLocaleString()} FCFA</span>
          <div class="cart-item-controls">
            <div class="quantity-selector">
              <button class="quantity-btn" onclick="window.App.updateQty(${item.id}, -1)">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn" onclick="window.App.updateQty(${item.id}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="window.App.removeFromCart(${item.id})">
              <i class="fa-solid fa-trash-can"></i> Retirer
            </button>
          </div>
        </div>
      </div>
    `).join('');

    itemsNode.innerHTML = itemsHTML;

    const subtotal = this.cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    subtotalNode.textContent = `${subtotal.toLocaleString()} FCFA`;
    totalNode.textContent = `${subtotal.toLocaleString()} FCFA`;
  },

  // ==========================================================================
  // LOGIQUE PANIER
  // ==========================================================================
  addToCart: function(id, quantity = 1, event = null, openDrawer = true) {
    if (event) event.stopPropagation();

    const products = window.DB.getProducts();
    const prod = products.find(p => p.id === id);

    if (!prod) return;

    // Vérification des stocks
    if (prod.stock < quantity) {
      alert(`Désolé, il ne reste que ${prod.stock} exemplaires de ce sac en stock.`);
      return;
    }

    const existingIndex = this.cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
      if (prod.stock < this.cart[existingIndex].quantity + quantity) {
        alert(`Stock insuffisant. Vous avez déjà ${this.cart[existingIndex].quantity} articles dans votre panier.`);
        return;
      }
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: prod.id,
        name: prod.name,
        reference: prod.reference,
        price: prod.price,
        image: prod.images[0],
        quantity: quantity
      });
    }

    this.saveCart();
    this.showToast(`${quantity}x "${prod.name}" ajouté(s) au panier.`);
    
    if (openDrawer) {
      this.openCartDrawer();
    }
  },

  removeFromCart: function(id) {
    this.cart = this.cart.filter(item => item.id !== id);
    this.saveCart();
    this.renderCartDrawerItems();
    this.showToast("Article retiré du panier.");
  },

  updateQty: function(id, change) {
    const index = this.cart.findIndex(item => item.id === id);
    if (index > -1) {
      const products = window.DB.getProducts();
      const prod = products.find(p => p.id === id);
      
      const newVal = this.cart[index].quantity + change;

      if (newVal < 1) {
        this.removeFromCart(id);
        return;
      }

      if (prod && prod.stock < newVal) {
        alert(`Désolé, seulement ${prod.stock} sacs sont en stock.`);
        return;
      }

      this.cart[index].quantity = newVal;
      this.saveCart();
      this.renderCartDrawerItems();
    }
  },

  clearCart: function() {
    this.cart = [];
    this.saveCart();
  },

  saveCart: function() {
    localStorage.setItem("oceanashop_cart", JSON.stringify(this.cart));
    this.updateBadges();
  },

  getCart: function() {
    return this.cart;
  },

  // ==========================================================================
  // LOGIQUE FAVORIS
  // ==========================================================================
  toggleFavorite: function(id, event) {
    if (event) event.stopPropagation();

    const idx = this.favorites.indexOf(id);
    const products = window.DB.getProducts();
    const prod = products.find(p => p.id === id);

    if (idx > -1) {
      this.favorites.splice(idx, 1);
      this.showToast(`"${prod?.name}" retiré de vos favoris.`);
    } else {
      this.favorites.push(id);
      this.showToast(`"${prod?.name}" ajouté à vos favoris.`);
    }

    localStorage.setItem("oceanashop_favorites", JSON.stringify(this.favorites));
    this.updateBadges();

    // Mettre à jour visuellement TOUS les boutons favoris de ce produit dans le DOM
    const isNowFav = this.isFavorite(id);
    document.querySelectorAll(`.fav-btn[data-product-id="${id}"]`).forEach(btn => {
      if (isNowFav) {
        btn.classList.add('active');
        btn.style.backgroundColor = 'var(--accent-gold)';
        btn.style.color = 'var(--primary-deep)';
      } else {
        btn.classList.remove('active');
        btn.style.backgroundColor = 'var(--bg-white)';
        btn.style.color = 'var(--text-dark)';
      }
    });
    
    // Si on est sur la page des favoris ou du compte, la rafraîchir
    if (window.location.hash.startsWith("#favorites") || window.location.hash.startsWith("#account")) {
      this.route();
    }
  },

  isFavorite: function(id) {
    return this.favorites.includes(id);
  },

  getFavorites: function() {
    const products = window.DB.getProducts();
    return products.filter(p => this.favorites.includes(p.id));
  },

  // ==========================================================================
  // BADGES & NOTIFICATIONS
  // ==========================================================================
  updateBadges: function() {
    // Total d'articles du panier
    const totalItems = this.cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = totalItems;

    // Total de favoris
    const favCount = document.getElementById("fav-count");
    if (favCount) favCount.textContent = this.favorites.length;
  },

  showToast: function(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-gold);"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Auto-remove toast from DOM
    setTimeout(() => {
      toast.remove();
    }, 3000);
  },

  // ==========================================================================
  // GESTION UTILISATEUR EN COURS
  // ==========================================================================
  setCurrentUser: function(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem("oceanashop_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("oceanashop_current_user");
    }
    this.updateNavigation();
  },

  getCurrentUser: function() {
    return this.currentUser;
  },

  updateNavigation: function() {
    // Si connecté avec le rôle admin, ajouter le lien admin au menu de navigation
    const navMenu = document.getElementById("nav-menu");
    if (!navMenu) return;

    // Enlever un ancien lien admin existant dans le menu principal
    const oldAdminLink = document.getElementById("nav-admin-entry");
    if (oldAdminLink) oldAdminLink.remove();

    if (this.currentUser && this.currentUser.role === 'admin') {
      const adminLi = document.createElement("li");
      adminLi.id = "nav-admin-entry";
      adminLi.innerHTML = `<a href="#admin" class="nav-link" style="color: var(--accent-gold); font-weight: 700;">Admin</a>`;
      navMenu.appendChild(adminLi);
    }
  }
};

// Lancer l'application au chargement de la page
window.addEventListener("DOMContentLoaded", () => {
  window.App = App;
  App.init();
  App.updateNavigation();
});
