// Page boutique interactive avec filtres avancés et barre de recherche

const ShopPage = {
  // Conserver l'état de filtrage
  state: {
    category: '',
    search: '',
    minPrice: 0,
    maxPrice: 100000,
    promoOnly: false,
    sortBy: 'popular'
  },

  render: function(params = {}) {
    // Initialiser les filtres à partir des query parameters
    if (params.cat) this.state.category = params.cat;
    else if (!params.keepFilters) this.state.category = '';
    
    if (params.promo) this.state.promoOnly = true;
    else if (!params.keepFilters) this.state.promoOnly = false;
    
    if (params.search) this.state.search = params.search;

    const products = window.DB.getProducts();
    
    // Filtrage
    let filteredProducts = products.filter(p => {
      // Catégorie
      if (this.state.category && p.category !== this.state.category) return false;
      // Recherche
      if (this.state.search) {
        const query = this.state.search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesRef = p.reference.toLowerCase().includes(query);
        const matchesColor = p.color.toLowerCase().includes(query);
        const matchesMat = p.material.toLowerCase().includes(query);
        if (!matchesName && !matchesRef && !matchesColor && !matchesMat) return false;
      }
      // Prix
      if (p.price < this.state.minPrice || p.price > this.state.maxPrice) return false;
      // Promotions
      if (this.state.promoOnly && !p.oldPrice) return false;
      
      return true;
    });

    // Tri
    if (this.state.sortBy === 'price-asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.state.sortBy === 'price-desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (this.state.sortBy === 'popular') {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    let productsListHTML = filteredProducts.map(p => `
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

    if (filteredProducts.length === 0) {
      productsListHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <i class="fa-regular fa-folder-open" style="font-size: 48px; color: var(--text-light); margin-bottom: 15px;"></i>
          <h3>Aucun produit trouvé</h3>
          <p style="color: var(--text-gray); margin-top: 10px;">Essayez de modifier ou de réinitialiser vos filtres de recherche.</p>
          <button class="btn btn-primary" onclick="window.ShopPage.resetFilters()" style="margin-top: 20px;">Réinitialiser les filtres</button>
        </div>
      `;
    }

    return `
      <section style="padding: 40px 0;">
        <div class="container">
          <h1 class="section-title">Notre Boutique</h1>
          <p class="section-subtitle">Découvrez notre gamme complète de sacs de luxe au Gabon.</p>
          
          <div style="display: grid; grid-template-columns: 280px 1fr; gap: 40px; margin-top: 30px;">
            <!-- Filters Sidebar -->
            <aside style="background: white; padding: 25px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); height: fit-content;">
              <h3 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Filtres</h3>
              
              <!-- Search inside shop -->
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-dark);">Rechercher</label>
                <div style="position: relative; display: flex; align-items: center;">
                  <input type="text" id="shop-search-input" value="${this.state.search}" placeholder="Nom, matière, couleur..." style="width: 100%; padding: 10px; padding-right: 35px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px;">
                  <i class="fa-solid fa-magnifying-glass" style="position: absolute; right: 12px; color: var(--text-gray); font-size: 14px;"></i>
                </div>
              </div>

              <!-- Categories list -->
              <div style="margin-bottom: 25px;">
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-dark);">Catégorie</label>
                <select id="shop-filter-cat" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px;">
                  <option value="">Toutes les catégories</option>
                  <option value="sacs-a-main" ${this.state.category === 'sacs-a-main' ? 'selected' : ''}>Sacs à Main</option>
                  <option value="sacs-bandouliere" ${this.state.category === 'sacs-bandouliere' ? 'selected' : ''}>Sacs Bandoulière</option>
                  <option value="sacs-cabas" ${this.state.category === 'sacs-cabas' ? 'selected' : ''}>Sacs Cabas</option>
                  <option value="pochettes" ${this.state.category === 'pochettes' ? 'selected' : ''}>Pochettes</option>
                  <option value="mini-sacs" ${this.state.category === 'mini-sacs' ? 'selected' : ''}>Mini-Sacs</option>
                  <option value="sacs-de-travail" ${this.state.category === 'sacs-de-travail' ? 'selected' : ''}>Sacs de Travail</option>
                  <option value="sacs-de-soiree" ${this.state.category === 'sacs-de-soiree' ? 'selected' : ''}>Sacs de Soirée</option>
                  <option value="accessoires" ${this.state.category === 'accessoires' ? 'selected' : ''}>Accessoires</option>
                </select>
              </div>

              <!-- Max Price filter -->
              <div style="margin-bottom: 25px;">
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-dark);">Budget Max : <span id="price-range-val" style="color: var(--primary-deep); font-weight: 700;">${this.state.maxPrice.toLocaleString()} FCFA</span></label>
                <input type="range" id="shop-filter-price" min="5000" max="100000" step="5000" value="${this.state.maxPrice}" style="width: 100%; accent-color: var(--primary-deep);">
              </div>

              <!-- Special promotion check -->
              <div style="margin-bottom: 25px; display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" id="shop-filter-promo" ${this.state.promoOnly ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--primary-deep);">
                <label for="shop-filter-promo" style="font-size: 13px; font-weight: 500; cursor: pointer;">Produits en Promotion</label>
              </div>

              <button class="btn btn-outline" onclick="window.ShopPage.resetFilters()" style="width: 100%; font-size: 12px; padding: 10px;">Réinitialiser</button>
            </aside>

            <!-- Products Content Area -->
            <div>
              <!-- Sort and Counter Bar -->
              <div style="background: white; padding: 15px 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; font-size: 14px;">
                <div style="color: var(--text-gray);">
                  <strong>${filteredProducts.length}</strong> sac(s) disponible(s)
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <label for="shop-sort" style="color: var(--text-gray); white-space: nowrap;">Trier par :</label>
                  <select id="shop-sort" style="padding: 6px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                    <option value="popular" ${this.state.sortBy === 'popular' ? 'selected' : ''}>Les plus populaires</option>
                    <option value="price-asc" ${this.state.sortBy === 'price-asc' ? 'selected' : ''}>Prix croissant</option>
                    <option value="price-desc" ${this.state.sortBy === 'price-desc' ? 'selected' : ''}>Prix décroissant</option>
                  </select>
                </div>
              </div>

              <div class="products-grid">
                ${productsListHTML}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  init: function() {
    const searchInput = document.getElementById("shop-search-input");
    const categorySelect = document.getElementById("shop-filter-cat");
    const priceRange = document.getElementById("shop-filter-price");
    const promoCheck = document.getElementById("shop-filter-promo");
    const sortSelect = document.getElementById("shop-sort");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.state.search = e.target.value;
        this.updateFilteredView();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        this.state.category = e.target.value;
        this.updateFilteredView();
      });
    }

    if (priceRange) {
      priceRange.addEventListener("input", (e) => {
        this.state.maxPrice = parseInt(e.target.value);
        document.getElementById("price-range-val").textContent = this.state.maxPrice.toLocaleString() + " FCFA";
        this.updateFilteredView();
      });
    }

    if (promoCheck) {
      promoCheck.addEventListener("change", (e) => {
        this.state.promoOnly = e.target.checked;
        this.updateFilteredView();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        this.updateFilteredView();
      });
    }
  },

  updateFilteredView: function() {
    // Re-rendre uniquement la partie boutique
    window.location.hash = `#shop?keepFilters=true`;
  },

  resetFilters: function() {
    this.state = {
      category: '',
      search: '',
      minPrice: 0,
      maxPrice: 100000,
      promoOnly: false,
      sortBy: 'popular'
    };
    window.location.hash = `#shop`;
  }
};

window.ShopPage = ShopPage;
