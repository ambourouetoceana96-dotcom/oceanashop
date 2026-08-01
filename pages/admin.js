// Tableau de bord administrateur d'OcéanaShop (stocks, prix, commandes, livraisons)

const AdminPage = {
  render: function() {
    const currentUser = window.App.getCurrentUser();
    
    // Protection de la page admin
    if (!currentUser || currentUser.role !== 'admin') {
      return `
        <div class="container" style="padding: 100px 20px; text-align: center;">
          <i class="fa-solid fa-lock" style="font-size: 48px; color: var(--danger); margin-bottom: 20px;"></i>
          <h2>Accès Refusé</h2>
          <p style="color: var(--text-gray); margin-top: 10px;">Veuillez vous connecter avec un compte administrateur pour voir cet espace.</p>
          <a href="#account" class="btn btn-primary" style="margin-top: 20px;">Se connecter</a>
        </div>
      `;
    }

    const products = window.DB.getProducts();
    const orders = window.DB.getOrders();
    const zones = window.DB.getShippingZones();
    const promos = window.DB.getPromoCodes();

    // Calcul des statistiques
    const totalRev = orders.reduce((acc, curr) => acc + curr.total, 0);
    const countPending = orders.filter(o => o.status !== 'Commande livrée').length;

    // Rendu des lignes de commandes
    let ordersListHTML = orders.map(o => `
      <tr style="border-bottom: 1px solid #f1f5f3;">
        <td style="padding: 10px 12px; font-weight: 600; color: var(--primary-deep); font-size: 13px;">${o.id}</td>
        <td style="padding: 10px 12px; font-size: 13px;">${o.shippingAddress.firstName} ${o.shippingAddress.lastName}</td>
        <td style="padding: 10px 12px; font-size: 13px; font-weight: 700;">${o.total.toLocaleString()} FCFA</td>
        <td style="padding: 10px 12px;">
          <select onchange="window.AdminPage.updateOrderStatus('${o.id}', this.value)" style="padding: 4px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; background-color: #f7f9f7;">
            <option value="Commande reçue" ${o.status === 'Commande reçue' ? 'selected' : ''}>Commande reçue</option>
            <option value="Paiement confirmé" ${o.status === 'Paiement confirmé' ? 'selected' : ''}>Paiement confirmé</option>
            <option value="En préparation" ${o.status === 'En préparation' ? 'selected' : ''}>En préparation</option>
            <option value="En cours de livraison" ${o.status === 'En cours de livraison' ? 'selected' : ''}>En cours de livraison</option>
            <option value="Commande livrée" ${o.status === 'Commande livrée' ? 'selected' : ''}>Commande livrée</option>
          </select>
        </td>
        <td style="padding: 10px 12px; text-align: right;">
          <button onclick="window.AccountPage.printInvoice('${o.id}')" class="btn btn-outline" style="padding: 5px 10px; font-size: 11px; text-transform: none;">Facture</button>
        </td>
      </tr>
    `).join('');

    if (orders.length === 0) {
      ordersListHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-light); font-style: italic;">Aucune commande pour le moment.</td></tr>`;
    }

    // Rendu des lignes de produits
    let productsListHTML = products.map(p => `
      <tr style="border-bottom: 1px solid #f1f5f3;">
        <td style="padding: 8px 12px; font-size: 13px;"><strong>${p.name}</strong></td>
        <td style="padding: 8px 12px; font-size: 13px;">${p.reference}</td>
        <td style="padding: 8px 12px; font-size: 13px; font-weight: 700;">${p.price.toLocaleString()} FCFA</td>
        <td style="padding: 8px 12px; font-size: 13px;">
          <input type="number" value="${p.stock}" onchange="window.AdminPage.updateProductStock(${p.id}, this.value)" style="width: 60px; padding: 4px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; text-align: center;">
        </td>
        <td style="padding: 8px 12px; text-align: right;">
          <button onclick="window.AdminPage.deleteProduct(${p.id})" style="color: var(--danger); font-size: 15px; padding: 5px;"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      </tr>
    `).join('');

    return `
      <section style="padding: 40px 0;">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; flex-wrap: wrap; gap: 15px;">
            <div>
              <h1 style="font-size: 32px; color: var(--primary-deep); font-family: var(--font-title); font-weight: 700;">Tableau de Bord Administrateur</h1>
              <p style="color: var(--text-gray); font-size: 14px;">Gestion des commandes, stocks et paramètres d'OcéanaShop</p>
            </div>
            <a href="#account" class="btn btn-outline" style="text-transform: none; font-size: 13px;"><i class="fa-solid fa-arrow-left"></i> Espace Client</a>
          </div>

          <!-- Cartes Statistiques -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px;">
            <div style="background: white; padding: 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--accent-gold);">
              <span style="font-size: 12px; color: var(--text-gray); font-weight: 600; text-transform: uppercase;">Chiffre d'Affaires</span>
              <h3 style="font-size: 26px; color: var(--primary-deep); font-weight: 700; margin-top: 5px;">${totalRev.toLocaleString()} FCFA</h3>
            </div>
            <div style="background: white; padding: 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--primary-deep);">
              <span style="font-size: 12px; color: var(--text-gray); font-weight: 600; text-transform: uppercase;">Commandes Total</span>
              <h3 style="font-size: 26px; color: var(--primary-deep); font-weight: 700; margin-top: 5px;">${orders.length}</h3>
            </div>
            <div style="background: white; padding: 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--secondary-blue);">
              <span style="font-size: 12px; color: var(--text-gray); font-weight: 600; text-transform: uppercase;">Commandes en cours</span>
              <h3 style="font-size: 26px; color: var(--primary-deep); font-weight: 700; margin-top: 5px;">${countPending}</h3>
            </div>
            <div style="background: white; padding: 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--success);">
              <span style="font-size: 12px; color: var(--text-gray); font-weight: 600; text-transform: uppercase;">Sacs au Catalogue</span>
              <h3 style="font-size: 26px; color: var(--primary-deep); font-weight: 700; margin-top: 5px;">${products.length}</h3>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: start;">
            <!-- Commandes Récentes -->
            <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); overflow-x: auto;">
              <h3 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 22px;">Gestion des Commandes</h3>
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-gray); font-size: 13px; text-transform: uppercase;">
                    <th style="padding: 10px 12px;">ID</th>
                    <th style="padding: 10px 12px;">Client</th>
                    <th style="padding: 10px 12px;">Total</th>
                    <th style="padding: 10px 12px;">Statut</th>
                    <th style="padding: 10px 12px; text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${ordersListHTML}
                </tbody>
              </table>
            </div>

            <div style="display: flex; flex-direction: column; gap: 30px;">
              <!-- Gestion rapide des stocks catalogue -->
              <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                <h3 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 22px;">Inventaire Produits</h3>
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                      <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-gray); font-size: 12px; text-transform: uppercase;">
                        <th style="padding: 8px 12px;">Nom</th>
                        <th style="padding: 8px 12px;">Référence</th>
                        <th style="padding: 8px 12px;">Prix</th>
                        <th style="padding: 8px 12px;">Stock</th>
                        <th style="padding: 8px 12px; text-align: right;">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productsListHTML}
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Formulaire ajout produit -->
              <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                <h3 style="color: var(--primary-deep); margin-bottom: 15px; font-family: var(--font-title); font-size: 22px;">Ajouter un Sac</h3>
                <form id="admin-add-product" style="display: flex; flex-direction: column; gap: 12px;">
                  <div>
                    <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 3px;">Nom du Sac *</label>
                    <input type="text" id="add-prod-name" placeholder="Ex: Sac Prestige Owendo" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px;">
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                      <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 3px;">Prix (FCFA) *</label>
                      <input type="number" id="add-prod-price" placeholder="45000" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px;">
                    </div>
                    <div>
                      <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 3px;">Stock initial *</label>
                      <input type="number" id="add-prod-stock" value="10" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px;">
                    </div>
                  </div>
                  <div>
                    <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 3px;">Catégorie *</label>
                    <select id="add-prod-cat" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px;">
                      <option value="sacs-a-main">Sacs à Main</option>
                      <option value="sacs-bandouliere">Sacs Bandoulière</option>
                      <option value="sacs-cabas">Sacs Cabas</option>
                      <option value="pochettes">Pochettes</option>
                      <option value="mini-sacs">Mini-sacs</option>
                      <option value="accessoires">Accessoires</option>
                    </select>
                  </div>
                  <div>
                    <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 3px;">URL Image (Placeholder possible) *</label>
                    <input type="text" id="add-prod-img" value="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px;">
                  </div>
                  <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 5px;">Créer le Produit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  init: function() {
    const addForm = document.getElementById("admin-add-product");
    if (addForm) {
      addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("add-prod-name").value.trim();
        const price = parseInt(document.getElementById("add-prod-price").value);
        const stock = parseInt(document.getElementById("add-prod-stock").value);
        const category = document.getElementById("add-prod-cat").value;
        const img = document.getElementById("add-prod-img").value;

        const products = window.DB.getProducts();
        const randId = products.length + 1;
        const randRef = `OS-SAC-ADD${Math.floor(100 + Math.random()*900)}`;

        const newProd = {
          id: randId,
          name: name,
          reference: randRef,
          category: category,
          price: price,
          oldPrice: null,
          images: [img],
          description: `${name} est un sac à main d'une finition soignée, sélectionné avec soin par OcéanaShop pour les femmes élégantes du Gabon.`,
          color: "Gamme de couleurs",
          material: "Matière synthétique / Textile",
          dimensions: "Standard",
          weight: "0.5 kg",
          stock: stock,
          rating: 5.0,
          reviewsCount: 0,
          badge: "Nouveauté"
        };

        products.push(newProd);
        window.DB.saveProducts(products);
        window.App.showToast(`Le produit "${name}" a été ajouté.`);
        
        // Re-rendre la page admin
        const appNode = document.getElementById("app");
        appNode.innerHTML = this.render();
        this.init();
      });
    }
  },

  updateOrderStatus: function(orderId, newStatus) {
    const orders = window.DB.getOrders();
    const order = orders.find(o => o.id === orderId);

    if (order) {
      order.status = newStatus;
      window.DB.saveOrders(orders);
      window.App.showToast(`Statut de la commande ${orderId} mis à jour : ${newStatus}`);
    }
  },

  updateProductStock: function(id, newStock) {
    const products = window.DB.getProducts();
    const prod = products.find(p => p.id === id);

    if (prod) {
      prod.stock = parseInt(newStock);
      window.DB.saveProducts(products);
      window.App.showToast(`Stock du sac ${prod.name} mis à jour.`);
    }
  },

  deleteProduct: function(id) {
    if (confirm("Voulez-vous vraiment retirer ce produit de la vente ?")) {
      let products = window.DB.getProducts();
      products = products.filter(p => p.id !== id);
      window.DB.saveProducts(products);
      window.App.showToast("Produit supprimé du catalogue.");
      
      const appNode = document.getElementById("app");
      appNode.innerHTML = this.render();
      this.init();
    }
  }
};

window.AdminPage = AdminPage;
