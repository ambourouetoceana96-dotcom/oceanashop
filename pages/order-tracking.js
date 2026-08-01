// Page de suivi de commande en temps réel avec indicateur visuel d'état (6 étapes)

const OrderTrackingPage = {
  render: function(params = {}) {
    const orderId = params.id;
    const orders = window.DB.getOrders();
    const order = orders.find(o => o.id === orderId);

    // Si pas de commande spécifiée ou introuvable, afficher le formulaire de recherche de commande
    if (!order) {
      return this.renderSearchForm();
    }

    const steps = [
      "Commande reçue",
      "Paiement confirmé",
      "Commande en préparation",
      "Commande expédiée",
      "Commande en livraison",
      "Commande livrée"
    ];

    const currentStepIndex = steps.indexOf(order.status);

    let progressStepsHTML = steps.map((step, idx) => {
      let statusClass = 'pending';
      if (idx < currentStepIndex) statusClass = 'completed';
      else if (idx === currentStepIndex) statusClass = 'active';

      let icon = 'fa-circle';
      if (idx === 0) icon = 'fa-file-invoice-dollar';
      else if (idx === 1) icon = 'fa-receipt';
      else if (idx === 2) icon = 'fa-box-open';
      else if (idx === 3) icon = 'fa-truck-ramp-box';
      else if (idx === 4) icon = 'fa-truck';
      else if (idx === 5) icon = 'fa-circle-check';

      return `
        <div style="display: flex; flex-direction: column; align-items: center; flex: 1; text-align: center; position: relative;">
          <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2; 
            background-color: ${statusClass === 'completed' ? 'var(--primary-deep)' : (statusClass === 'active' ? 'var(--accent-gold)' : '#e2e8f0')}; 
            color: ${statusClass === 'completed' ? '#fff' : (statusClass === 'active' ? 'var(--primary-deep)' : 'var(--text-gray)')}; 
            border: 2px solid ${statusClass === 'active' ? 'var(--accent-gold)' : 'transparent'};">
            <i class="fa-solid ${icon}"></i>
          </div>
          <span style="font-size: 11px; font-weight: 600; margin-top: 8px; color: ${statusClass === 'active' ? 'var(--primary-deep)' : 'var(--text-gray)'};">${step}</span>
        </div>
      `;
    }).join('');

    let itemsHTML = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f3; padding-bottom: 10px; margin-bottom: 10px;">
        <span style="font-size: 14px;">${item.name} <strong style="color: var(--primary-deep)">x${item.quantity}</strong></span>
        <span style="font-weight: 600; font-size: 14px;">${(item.price * item.quantity).toLocaleString()} FCFA</span>
      </div>
    `).join('');

    return `
      <section style="padding: 40px 0;">
        <div class="container" style="max-width: 800px;">
          <div style="background: white; padding: 40px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(12, 62, 38, 0.03);">
            
            <!-- En-tête de commande -->
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
              <div>
                <span style="font-size: 13px; color: var(--text-gray); text-transform: uppercase; font-weight: 600;">Suivi de Commande en Direct</span>
                <h1 style="color: var(--primary-deep); font-size: 28px; font-family: var(--font-title); font-weight: 700; margin-top: 5px;">${order.id}</h1>
                <span style="font-size: 13px; color: var(--text-gray);">Date : <strong>${order.date}</strong> | Mode : <strong>${order.paymentMethod}</strong></span>
              </div>
              <button onclick="window.AccountPage.printInvoice('${order.id}')" class="btn btn-primary" style="padding: 10px 20px; font-size: 13px; text-transform: none;">
                <i class="fa-solid fa-file-pdf"></i> Télécharger la Facture
              </button>
            </div>

            <!-- Barre de suivi dynamique -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; position: relative; padding: 0 10px;">
              <div style="position: absolute; height: 4px; background: #cbd5e1; width: calc(100% - 60px); top: 18px; left: 30px; z-index: 1;">
                <div style="height: 100%; background: var(--primary-deep); width: ${(currentStepIndex / (steps.length - 1)) * 100}%; transition: width 0.5s ease;"></div>
              </div>
              ${progressStepsHTML}
            </div>

            <!-- Récapitulatif Adresse & Articles -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px; border-top: 1px solid var(--border-color); padding-top: 30px;">
              <div>
                <h3 style="color: var(--primary-deep); font-family: var(--font-title); font-size: 18px; margin-bottom: 15px;">Détails de Livraison</h3>
                <p style="font-size: 14px; line-height: 1.6; color: var(--text-gray);">
                  <strong>Destinataire :</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                  <strong>Téléphone :</strong> ${order.shippingAddress.phone}<br>
                  <strong>Ville :</strong> ${order.shippingAddress.city}<br>
                  <strong>Quartier :</strong> ${order.shippingAddress.quarter}<br>
                  <strong>Point de repère :</strong> ${order.shippingAddress.landmark || 'Non fourni'}
                </p>
              </div>
              <div>
                <h3 style="color: var(--primary-deep); font-family: var(--font-title); font-size: 18px; margin-bottom: 15px;">Articles Commandés</h3>
                <div>
                  ${itemsHTML}
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 16px; color: var(--primary-deep); margin-top: 15px;">
                  <span>Total Payé :</span>
                  <span>${order.total.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <!-- Aide support -->
            <div style="margin-top: 40px; padding: 20px; background-color: var(--bg-sand); border-left: 4px solid var(--accent-gold); border-radius: var(--radius-sm); text-align: center;">
              <p style="font-size: 14px; color: var(--text-dark); margin-bottom: 15px;">Une question concernant votre livraison ? Notre équipe logistique est disponible sur WhatsApp.</p>
              <a href="https://wa.me/241077000000?text=Bonjour%20OcéanaShop,%20je%20souhaite%20des%20nouvelles%20de%20ma%20commande%20${order.id}" target="_blank" class="btn btn-accent" style="text-transform: none; padding: 10px 20px;">
                <i class="fa-brands fa-whatsapp" style="font-size: 18px;"></i> Contacter le support de livraison
              </a>
            </div>

          </div>
        </div>
      </section>
    `;
  },

  renderSearchForm: function() {
    return `
      <section style="padding: 60px 0;">
        <div class="container" style="max-width: 500px; text-align: center;">
          <i class="fa-solid fa-magnifying-glass-location" style="font-size: 48px; color: var(--text-light); margin-bottom: 20px;"></i>
          <h1 style="color: var(--primary-deep); font-family: var(--font-title); font-size: 26px; margin-bottom: 10px;">Suivre une commande</h1>
          <p style="color: var(--text-gray); font-size: 14px; margin-bottom: 30px;">Entrez votre numéro de commande pour connaître l'état de livraison.</p>
          
          <form id="order-search-form" style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 15px; text-align: left;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Numéro de Commande *</label>
              <input type="text" id="search-order-id" placeholder="Ex: CMD-2026-123456" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); text-transform: uppercase;">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Rechercher</button>
          </form>
        </div>
      </section>
    `;
  },

  init: function() {
    const searchForm = document.getElementById("order-search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const orderId = document.getElementById("search-order-id").value.trim().toUpperCase();
        
        const orders = window.DB.getOrders();
        if (orders.some(o => o.id === orderId)) {
          window.location.hash = `#order-tracking?id=${orderId}`;
        } else {
          alert("Commande introuvable. Veuillez vérifier la référence.");
        }
      });
    }
  }
};

window.OrderTrackingPage = OrderTrackingPage;
