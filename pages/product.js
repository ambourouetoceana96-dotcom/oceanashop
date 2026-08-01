// Fiche produit haut de gamme interactive

const ProductPage = {
  activeImageIndex: 0,
  
  render: function(params = {}) {
    const productId = parseInt(params.id);
    const products = window.DB.getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
      return `
        <div class="container" style="padding: 100px 20px; text-align: center;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; color: var(--danger); margin-bottom: 20px;"></i>
          <h2>Sac introuvable</h2>
          <p style="color: var(--text-gray); margin-top: 10px;">Le sac recherché n'existe pas ou a été retiré de la vente.</p>
          <a href="#shop" class="btn btn-primary" style="margin-top: 20px;">Retourner à la boutique</a>
        </div>
      `;
    }

    // Récupérer les avis du localStorage pour ce produit
    const allReviews = window.DB.getReviews();
    const productReviews = allReviews.filter(r => r.productId === product.id);

    // Produits suggérés (même catégorie)
    const suggestions = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    let suggestionsHTML = suggestions.map(p => `
      <div class="product-card">
        <div class="product-img-wrapper">
          <a href="#product?id=${p.id}"><img src="${p.images[0]}" alt="${p.name}"></a>
        </div>
        <div class="product-info" style="padding: 15px;">
          <h4 style="font-family: var(--font-body); font-size: 14px; font-weight: 600;"><a href="#product?id=${p.id}">${p.name}</a></h4>
          <span style="font-weight: 700; color: var(--primary-deep); font-size: 14px;">${p.price.toLocaleString()} FCFA</span>
        </div>
      </div>
    `).join('');

    // Rendu des miniatures d'images
    let thumbnailsHTML = product.images.map((img, idx) => `
      <div class="thumb-wrapper ${idx === this.activeImageIndex ? 'active' : ''}" onclick="window.ProductPage.setImage(${idx})" style="border: 2px solid ${idx === this.activeImageIndex ? 'var(--accent-gold)' : 'var(--border-color)'}; cursor: pointer; border-radius: var(--radius-sm); overflow: hidden; width: 60px; height: 60px;">
        <img src="${img}" alt="miniature ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
    `).join('');

    // Liste des avis clients
    let reviewsListHTML = productReviews.map(r => `
      <div style="border-bottom: 1px solid #f1f5f3; padding-bottom: 15px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: var(--primary-deep); font-size: 14px;">${r.author}</strong>
          <span style="font-size: 12px; color: var(--text-light);">${r.date}</span>
        </div>
        <div style="color: var(--accent-gold); font-size: 12px; margin-bottom: 8px;">
          ${Array(r.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
          ${Array(5 - r.rating).fill('<i class="fa-regular fa-star"></i>').join('')}
        </div>
        <p style="font-size: 14px; color: var(--text-gray);">${r.comment}</p>
      </div>
    `).join('');

    if (productReviews.length === 0) {
      reviewsListHTML = `<p style="color: var(--text-light); font-style: italic; font-size: 14px;">Aucun avis pour le moment. Soyez la première à donner votre avis !</p>`;
    }

    return `
      <section style="padding: 40px 0;">
        <div class="container">
          <!-- Fil d'ariane -->
          <div style="font-size: 13px; color: var(--text-gray); margin-bottom: 30px;">
            <a href="#home">Accueil</a> &nbsp;/&nbsp; <a href="#shop">Boutique</a> &nbsp;/&nbsp; <a href="#shop?cat=${product.category}">${product.category.replace('-', ' ')}</a> &nbsp;/&nbsp; <span style="color: var(--primary-deep); font-weight: 500;">${product.name}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
            
            <!-- Galerie Photo Gauche -->
            <div>
              <div id="product-zoom-container" style="position: relative; overflow: hidden; border-radius: var(--radius-md); aspect-ratio: 1; background-color: #f7f7f7; border: 1px solid var(--border-color); cursor: zoom-in;">
                <img id="main-product-img" src="${product.images[this.activeImageIndex]}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.1s ease;">
              </div>
              <div style="display: flex; gap: 10px; margin-top: 15px; justify-content: center;">
                ${thumbnailsHTML}
              </div>
            </div>

            <!-- Infos Produit Droite -->
            <div>
              ${product.badge ? `<span style="background-color: var(--accent-gold); color: var(--primary-deep); font-weight: 700; text-transform: uppercase; font-size: 11px; padding: 4px 12px; border-radius: var(--radius-sm); display: inline-block; margin-bottom: 10px;">${product.badge}</span>` : ''}
              <h1 style="font-size: 32px; color: var(--primary-deep); margin-bottom: 10px; font-weight: 700;">${product.name}</h1>
              
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <div style="color: var(--accent-gold); font-size: 14px;">
                  ${Array(Math.round(product.rating)).fill('<i class="fa-solid fa-star"></i>').join('')}
                </div>
                <span style="font-size: 13px; color: var(--text-gray);">${product.rating} (${productReviews.length} avis client)</span>
                <span style="color: var(--text-light);">|</span>
                <span style="font-size: 13px; color: var(--text-gray);">Réf : <strong>${product.reference}</strong></span>
              </div>

              <!-- Price Box -->
              <div style="background-color: var(--bg-sand); padding: 15px 20px; border-radius: var(--radius-sm); margin-bottom: 25px;">
                <div style="display: flex; align-items: baseline; gap: 15px;">
                  <span style="font-size: 26px; font-weight: 700; color: var(--primary-deep);">${product.price.toLocaleString()} FCFA</span>
                  ${product.oldPrice ? `<span style="font-size: 16px; text-decoration: line-through; color: var(--text-light);">${product.oldPrice.toLocaleString()} FCFA</span>` : ''}
                </div>
                <div style="font-size: 13px; color: var(--text-gray); margin-top: 5px;">
                  ${product.stock > 0 ? `<span style="color: var(--success); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> En stock (${product.stock} disponibles)</span>` : '<span style="color: var(--danger); font-weight: 600;"><i class="fa-solid fa-circle-xmark"></i> Épuisé</span>'}
                </div>
              </div>

              <!-- Description -->
              <p style="color: var(--text-gray); font-size: 15px; line-height: 1.7; margin-bottom: 25px;">${product.description}</p>

              <!-- Attributes list -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 15px; background: #fbfcfb; border-radius: var(--radius-sm); margin-bottom: 30px; font-size: 14px;">
                <div>Couleur : <strong>${product.color}</strong></div>
                <div>Matière : <strong>${product.material}</strong></div>
                <div>Dimensions : <strong>${product.dimensions}</strong></div>
                <div>Poids : <strong>${product.weight}</strong></div>
              </div>

              <!-- Actions block -->
              <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <!-- Quantity -->
                <div class="quantity-selector" style="height: 48px;">
                  <button class="quantity-btn" onclick="window.ProductPage.changeQty(-1)" style="width: 40px; font-size: 18px;">-</button>
                  <span id="product-qty-val" class="quantity-value" style="width: 45px; font-size: 16px;">1</span>
                  <button class="quantity-btn" onclick="window.ProductPage.changeQty(1)" style="width: 40px; font-size: 18px;">+</button>
                </div>

                <button class="btn btn-primary" onclick="window.ProductPage.handleAddToCart(${product.id})" style="flex: 1; height: 48px; text-transform: none;">
                  <i class="fa-solid fa-bag-shopping"></i> Ajouter au panier
                </button>
                
                <button class="btn btn-outline" onclick="window.ProductPage.handleBuyNow(${product.id})" style="height: 48px; text-transform: none; font-weight: 700; border-color: var(--accent-gold); color: var(--primary-deep); background: var(--accent-gold);">
                  Acheter maintenant
                </button>

                <button class="fav-btn ${window.App.isFavorite(product.id) ? 'active' : ''}" data-product-id="${product.id}" onclick="window.App.toggleFavorite(${product.id}, event)" style="width: 48px; height: 48px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-white); color: var(--text-dark);" title="Ajouter aux favoris">
                  <i class="fa-solid fa-heart" style="font-size: 18px;"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Section Avis & Laisser un avis -->
          <div style="margin-top: 40px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: start;">
            <!-- Avis existants -->
            <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
              <h3 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 22px;">Avis des clientes</h3>
              <div id="reviews-list-container">
                ${reviewsListHTML}
              </div>
            </div>

            <!-- Formulaire ajout avis -->
            <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
              <h3 style="color: var(--primary-deep); margin-bottom: 10px; font-family: var(--font-title); font-size: 22px;">Donner votre avis</h3>
              <p style="font-size: 13px; color: var(--text-gray); margin-bottom: 20px;">Partagez votre expérience avec cette pièce de maroquinerie.</p>
              
              <form id="add-review-form" style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Votre Nom</label>
                  <input type="text" id="review-author" placeholder="Ex: Sylvie B." required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                </div>
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Note (Étoiles)</label>
                  <select id="review-rating" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px;">
                    <option value="5">5 Étoiles - Excellent</option>
                    <option value="4">4 Étoiles - Très bon</option>
                    <option value="3">3 Étoiles - Moyen</option>
                    <option value="2">2 Étoiles - Insatisfaisant</option>
                    <option value="1">1 Étoile - Mauvais</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Votre Commentaire</label>
                  <textarea id="review-comment" rows="4" placeholder="Ce sac est..." required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-family: inherit; resize: none;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Publier l'avis</button>
              </form>
            </div>
          </div>

          <!-- Produits similaires -->
          ${suggestions.length > 0 ? `
            <div style="margin-top: 60px;">
              <h3 style="color: var(--primary-deep); margin-bottom: 25px; font-family: var(--font-title); font-size: 24px; text-align: center;">Vous aimerez aussi</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px;">
                ${suggestionsHTML}
              </div>
            </div>
          ` : ''}

        </div>
      </section>
    `;
  },

  init: function(params = {}) {
    const productId = parseInt(params.id);
    
    // Zoom feature
    const zoomContainer = document.getElementById("product-zoom-container");
    const mainImg = document.getElementById("main-product-img");
    
    if (zoomContainer && mainImg) {
      zoomContainer.addEventListener("mousemove", (e) => {
        const rect = zoomContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        mainImg.style.transformOrigin = `${x}px ${y}px`;
        mainImg.style.transform = "scale(1.8)";
      });
      
      zoomContainer.addEventListener("mouseleave", () => {
        mainImg.style.transform = "scale(1)";
      });
    }

    // Formulaire avis
    const reviewForm = document.getElementById("add-review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const author = document.getElementById("review-author").value;
        const rating = parseInt(document.getElementById("review-rating").value);
        const comment = document.getElementById("review-comment").value;

        const reviews = window.DB.getReviews();
        reviews.unshift({
          productId: productId,
          author: author,
          rating: rating,
          comment: comment,
          date: new Date().toISOString().split('T')[0]
        });

        window.DB.saveReviews(reviews);
        window.App.showToast("Votre avis a bien été publié ! Merci pour votre confiance.");
        
        // Re-rendre la page pour voir l'avis
        window.location.reload();
      });
    }
  },

  setImage: function(index) {
    this.activeImageIndex = index;
    // Re-rendre la page pour rafraîchir l'image principale active
    const urlParams = window.App.getQueryParams();
    const appNode = document.getElementById("app");
    appNode.innerHTML = this.render(urlParams);
    this.init(urlParams);
  },

  changeQty: function(amount) {
    const qtyNode = document.getElementById("product-qty-val");
    if (qtyNode) {
      let val = parseInt(qtyNode.textContent) + amount;
      if (val < 1) val = 1;
      qtyNode.textContent = val;
    }
  },

  handleAddToCart: function(id) {
    const qtyNode = document.getElementById("product-qty-val");
    const qty = qtyNode ? parseInt(qtyNode.textContent) : 1;
    window.App.addToCart(id, qty);
  },

  handleBuyNow: function(id) {
    const qtyNode = document.getElementById("product-qty-val");
    const qty = qtyNode ? parseInt(qtyNode.textContent) : 1;
    // Ajouter au panier et naviguer vers le checkout
    window.App.addToCart(id, qty, null, false);
    window.location.hash = "#checkout";
  }
};

window.ProductPage = ProductPage;
