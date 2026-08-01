// Page d'accueil dynamique OcéanaShop

const HomePage = {
  render: function() {
    const products = window.DB.getProducts().slice(0, 4); // Top 4 nouveautés/meilleures ventes
    const reviews = window.DB.getReviews().slice(0, 3);
    
    let productsHTML = products.map(p => `
      <div class="product-card">
        <div class="product-img-wrapper">
          ${p.badge ? `<span class="product-badge ${p.badge === 'Promotion' ? 'promo' : ''}">${p.badge}</span>` : ''}
          <a href="#product?id=${p.id}">
            <img src="${p.images[0]}" alt="${p.name}">
          </a>
          <button class="fav-btn ${window.App.isFavorite(p.id) ? 'active' : ''}" data-product-id="${p.id}" onclick="window.App.toggleFavorite(${p.id}, event)" title="Ajouter aux favoris">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>
        <div class="product-info">
          <span class="product-cat">${p.category.replace('-', ' ')}</span>
          <h3 class="product-title"><a href="#product?id=${p.id}">${p.name}</a></h3>
          <div class="product-rating">
            <i class="fa-solid fa-star"></i>
            <span>${p.rating} (${p.reviewsCount})</span>
          </div>
          <div class="product-price-row">
            <div>
              <span class="price">${p.price.toLocaleString()} FCFA</span>
              ${p.oldPrice ? `<span class="price-old">${p.oldPrice.toLocaleString()} FCFA</span>` : ''}
            </div>
            <button class="btn-card-add" onclick="window.App.addToCart(${p.id}, 1, event)" title="Ajouter au panier">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    let reviewsHTML = reviews.map(r => `
      <div style="background: white; padding: 25px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(12, 62, 38, 0.03);">
        <div style="color: var(--accent-gold); margin-bottom: 15px;">
          ${Array(r.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
        </div>
        <p style="font-style: italic; color: var(--text-gray); margin-bottom: 15px; font-size: 14px;">"${r.comment}"</p>
        <div style="font-weight: 600; color: var(--primary-deep); font-size: 14px;">${r.author}</div>
      </div>
    `).join('');

    return `
      <!-- Hero Banner -->
      <section style="background: linear-gradient(135deg, var(--primary-deep) 0%, #154c33 100%); color: var(--bg-sand); padding: 100px 0; position: relative; overflow: hidden;">
        <!-- Subtly styled background decoration lines -->
        <div style="position: absolute; width: 400px; height: 400px; border-radius: 50%; border: 2px dashed rgba(212, 175, 55, 0.1); top: -100px; right: -100px; pointer-events: none;"></div>
        <div style="position: absolute; width: 250px; height: 250px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.05); bottom: -50px; left: -50px; pointer-events: none;"></div>
        
        <div class="container" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: center;">
          <div>
            <span style="color: var(--accent-gold); text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; font-size: 12px; display: inline-block; margin-bottom: 15px;">Collections Exclusives Gabon</span>
            <h1 style="font-size: 48px; line-height: 1.1; margin-bottom: 20px; font-weight: 700;">Découvrez l’élégance qui vous ressemble</h1>
            <p style="font-size: 18px; color: #b9d2c4; margin-bottom: 30px; max-width: 550px;">Des sacs raffinés sélectionnés pour accompagner votre style et sublimer votre quotidien au Gabon.</p>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
              <a href="#shop" class="btn btn-accent">Découvrir la collection</a>
              <a href="#shop?promo=true" class="btn btn-outline" style="border-color: var(--bg-sand); color: var(--bg-sand);">Nos promotions</a>
            </div>
          </div>
          <!-- Beautiful Unsplash Handbag display image -->
          <div style="position: relative; display: flex; justify-content: center;">
            <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80" alt="OcéanaShop Handbag" style="border-radius: var(--radius-md); box-shadow: var(--shadow-lg); border: 4px solid rgba(255, 255, 255, 0.08); max-width: 100%; height: 350px; object-fit: cover;">
          </div>
        </div>
      </section>

      <!-- Trust Badges -->
      <section style="background-color: var(--bg-white); padding: 30px 0; border-bottom: 1px solid var(--border-color);">
        <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; text-align: center;">
          <div>
            <i class="fa-solid fa-truck-fast" style="font-size: 28px; color: var(--accent-gold); margin-bottom: 10px;"></i>
            <h4 style="font-size: 15px; color: var(--primary-deep); font-weight: 600;">Livraison au Gabon</h4>
            <p style="font-size: 13px; color: var(--text-gray);">À domicile ou en point agence</p>
          </div>
          <div>
            <i class="fa-solid fa-shield-halved" style="font-size: 28px; color: var(--accent-gold); margin-bottom: 10px;"></i>
            <h4 style="font-size: 15px; color: var(--primary-deep); font-weight: 600;">Paiement Sécurisé</h4>
            <p style="font-size: 13px; color: var(--text-gray);">Airtel Money, Moov & Carte</p>
          </div>
          <div>
            <i class="fa-solid fa-headset" style="font-size: 28px; color: var(--accent-gold); margin-bottom: 10px;"></i>
            <h4 style="font-size: 15px; color: var(--primary-deep); font-weight: 600;">Service WhatsApp 24/7</h4>
            <p style="font-size: 13px; color: var(--text-gray);">Une équipe à votre écoute</p>
          </div>
          <div>
            <i class="fa-solid fa-file-invoice" style="font-size: 28px; color: var(--accent-gold); margin-bottom: 10px;"></i>
            <h4 style="font-size: 15px; color: var(--primary-deep); font-weight: 600;">Facture Automatique</h4>
            <p style="font-size: 13px; color: var(--text-gray);">Document PDF officiel fourni</p>
          </div>
        </div>
      </section>

      <!-- Category quick navigation section -->
      <section style="padding: 60px 0;">
        <div class="container">
          <h2 class="section-title">Parcourir par catégorie</h2>
          <p class="section-subtitle">Trouvez le style de sac idéal pour chaque occasion.</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <a href="#shop?cat=sacs-a-main" style="background: white; border-radius: var(--radius-md); padding: 30px 20px; text-align: center; box-shadow: var(--shadow-sm); display: block;">
              <i class="fa-solid fa-briefcase" style="font-size: 32px; color: var(--primary-deep); margin-bottom: 15px;"></i>
              <h3 style="font-size: 16px; font-family: var(--font-body); font-weight: 600;">Sacs à Main</h3>
            </a>
            <a href="#shop?cat=sacs-bandouliere" style="background: white; border-radius: var(--radius-md); padding: 30px 20px; text-align: center; box-shadow: var(--shadow-sm); display: block;">
              <i class="fa-solid fa-person-breastfeeding" style="font-size: 32px; color: var(--primary-deep); margin-bottom: 15px;"></i>
              <h3 style="font-size: 16px; font-family: var(--font-body); font-weight: 600;">Sacs Bandoulière</h3>
            </a>
            <a href="#shop?cat=sacs-cabas" style="background: white; border-radius: var(--radius-md); padding: 30px 20px; text-align: center; box-shadow: var(--shadow-sm); display: block;">
              <i class="fa-solid fa-bag-shopping" style="font-size: 32px; color: var(--primary-deep); margin-bottom: 15px;"></i>
              <h3 style="font-size: 16px; font-family: var(--font-body); font-weight: 600;">Sacs Cabas</h3>
            </a>
            <a href="#shop?cat=pochettes" style="background: white; border-radius: var(--radius-md); padding: 30px 20px; text-align: center; box-shadow: var(--shadow-sm); display: block;">
              <i class="fa-solid fa-gem" style="font-size: 32px; color: var(--primary-deep); margin-bottom: 15px;"></i>
              <h3 style="font-size: 16px; font-family: var(--font-body); font-weight: 600;">Pochettes & Soirées</h3>
            </a>
          </div>
        </div>
      </section>

      <!-- Selection of Best Products -->
      <section style="padding: 60px 0; background-color: var(--bg-white);">
        <div class="container">
          <h2 class="section-title">Sélection OcéanaShop</h2>
          <p class="section-subtitle">Découvrez nos produits les plus populaires et convoités du moment.</p>
          
          <div class="products-grid">
            ${productsHTML}
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="#shop" class="btn btn-primary">Voir toute la boutique</a>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section style="padding: 60px 0;">
        <div class="container">
          <h2 class="section-title">Ce que disent nos clientes</h2>
          <p class="section-subtitle">Découvrez les retours d'expérience de nos clientes ravies à travers le Gabon.</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
            ${reviewsHTML}
          </div>
        </div>
      </section>

      <!-- Newsletter and Contact -->
      <section style="padding: 80px 0; background-color: var(--primary-deep); color: white; text-align: center; position: relative;">
        <div class="container" style="max-width: 600px;">
          <h2 style="font-size: 32px; margin-bottom: 15px; color: var(--accent-gold);">Rejoignez l'univers OcéanaShop</h2>
          <p style="color: #b9d2c4; margin-bottom: 30px; font-size: 15px;">Inscrivez-vous à notre lettre d'informations pour être informée en avant-première des nouveaux arrivages de sacs et des ventes privées au Gabon.</p>
          <form id="home-newsletter-form" style="display: flex; gap: 10px;">
            <input type="email" placeholder="Entrez votre e-mail" required style="flex: 1; padding: 15px; border-radius: var(--radius-sm); border: none;">
            <button type="submit" class="btn btn-accent" style="white-space: nowrap;">S'abonner</button>
          </form>
        </div>
      </section>
    `;
  },
  
  init: function() {
    const newsletterForm = document.getElementById("home-newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        window.App.showToast("Merci de votre inscription à la newsletter OcéanaShop !");
        newsletterForm.reset();
      });
    }
  }
};

window.HomePage = HomePage;
