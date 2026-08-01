// Espace client complet avec gestion de connexion, d'inscription et de favoris

const AccountPage = {
  render: function() {
    const currentUser = window.App.getCurrentUser();

    // Si non connecté, afficher le formulaire de connexion/inscription
    if (!currentUser) {
      return this.renderAuthForm();
    }

    // Si connecté, afficher le tableau de bord client
    return this.renderDashboard(currentUser);
  },

  renderAuthForm: function() {
    return `
      <section style="padding: 60px 0;">
        <div class="container" style="max-width: 900px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <!-- Connexion -->
          <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
            <h2 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 24px;">Connexion</h2>
            <form id="login-form" style="display: flex; flex-direction: column; gap: 15px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Adresse e-mail</label>
                <input type="email" id="login-email" placeholder="Ex: client@test.ga" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Mot de passe</label>
                <input type="password" id="login-password" placeholder="Votre mot de passe" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">Se connecter</button>
            </form>
            <p style="font-size: 13px; color: var(--text-gray); margin-top: 15px; text-align: center;">Compte Démo Client : <strong>client@test.ga</strong> / MDP : <strong>password</strong></p>
            <p style="font-size: 13px; color: var(--text-gray); text-align: center;">Compte Admin : <strong>admin@oceanashop.ga</strong> / MDP : <strong>admin</strong></p>
          </div>

          <!-- Inscription -->
          <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
            <h2 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 24px;">Créer un compte</h2>
            <form id="signup-form" style="display: flex; flex-direction: column; gap: 15px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Prénom</label>
                  <input type="text" id="signup-firstname" placeholder="Prénom" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                </div>
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Nom</label>
                  <input type="text" id="signup-lastname" placeholder="Nom" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Téléphone (+241 Gabon)</label>
                <input type="tel" id="signup-phone" placeholder="Ex: +241 077 12 34 56" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Adresse e-mail</label>
                <input type="email" id="signup-email" placeholder="client@domaine.com" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">Mot de passe</label>
                <input type="password" id="signup-password" placeholder="Mot de passe sécurisé" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
              </div>
              <button type="submit" class="btn btn-accent" style="width: 100%;">Créer mon compte</button>
            </form>
          </div>
        </div>
      </section>
    `;
  },

  renderDashboard: function(user) {
    const orders = window.DB.getOrders().filter(o => o.userEmail === user.email);
    const favorites = window.App.getFavorites();

    // Rendu des favoris
    let favoritesHTML = favorites.map(p => `
      <div style="display: flex; gap: 15px; align-items: center; background: white; padding: 15px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 10px;">
        <img src="${p.images[0]}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);">
        <div style="flex: 1;">
          <h4 style="font-size: 14px; font-weight: 600;"><a href="#product?id=${p.id}">${p.name}</a></h4>
          <span style="font-weight: 700; color: var(--primary-deep); font-size: 14px;">${p.price.toLocaleString()} FCFA</span>
        </div>
        <button class="btn btn-primary" onclick="window.App.addToCart(${p.id}, 1)" style="padding: 8px 15px; font-size: 12px; text-transform: none;">
          <i class="fa-solid fa-cart-plus"></i>
        </button>
        <button onclick="window.App.toggleFavorite(${p.id}, event)" style="color: var(--danger); font-size: 18px; padding: 5px;">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    if (favorites.length === 0) {
      favoritesHTML = `<p style="color: var(--text-light); font-style: italic; font-size: 14px;">Aucun sac favori enregistré.</p>`;
    }

    // Rendu de l'historique des commandes
    let ordersHTML = orders.map(o => `
      <tr style="border-bottom: 1px solid #f1f5f3;">
        <td style="padding: 12px; font-weight: 600; color: var(--primary-deep); font-size: 13px;">${o.id}</td>
        <td style="padding: 12px; font-size: 13px;">${o.date}</td>
        <td style="padding: 12px; font-weight: 700; font-size: 13px;">${o.total.toLocaleString()} FCFA</td>
        <td style="padding: 12px;">
          <span style="background-color: ${this.getStatusBgColor(o.status)}; color: ${this.getStatusTextColor(o.status)}; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase;">
            ${o.status}
          </span>
        </td>
        <td style="padding: 12px; text-align: right;">
          <a href="#order-tracking?id=${o.id}" class="btn btn-outline" style="padding: 6px 12px; font-size: 11px; text-transform: none; font-weight: 600;">Suivre</a>
          <button onclick="window.AccountPage.printInvoice('${o.id}')" class="btn btn-primary" style="padding: 6px 12px; font-size: 11px; text-transform: none; font-weight: 600; margin-left: 5px;">Facture</button>
        </td>
      </tr>
    `).join('');

    if (orders.length === 0) {
      ordersHTML = `
        <tr>
          <td colspan="5" style="padding: 40px; text-align: center; color: var(--text-light); font-style: italic;">
            Vous n'avez pas encore passé de commande chez OcéanaShop.
          </td>
        </tr>
      `;
    }

    return `
      <section style="padding: 40px 0;">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <div>
              <h1 style="font-size: 32px; color: var(--primary-deep); font-family: var(--font-title); font-weight: 700;">Mon Espace Client</h1>
              <p style="color: var(--text-gray); font-size: 14px;">Ravi de vous revoir, <strong>${user.firstName} ${user.lastName}</strong></p>
            </div>
            <button class="btn btn-outline" onclick="window.AccountPage.logout()" style="text-transform: none; font-size: 13px; font-weight: 600;"><i class="fa-solid fa-power-off"></i> Déconnexion</button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;">
            <!-- Colonne commandes -->
            <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); overflow-x: auto;">
              <h3 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 22px;">Mes Commandes</h3>
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-gray); font-size: 13px; text-transform: uppercase;">
                    <th style="padding: 10px 12px;">N° Commande</th>
                    <th style="padding: 10px 12px;">Date</th>
                    <th style="padding: 10px 12px;">Total</th>
                    <th style="padding: 10px 12px;">Statut</th>
                    <th style="padding: 10px 12px; text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${ordersHTML}
                </tbody>
              </table>
            </div>

            <!-- Colonne favoris & profil -->
            <div style="display: flex; flex-direction: column; gap: 30px;">
              <!-- Profil -->
              <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                <h3 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 22px;">Informations Personnelles</h3>
                <div style="font-size: 15px; color: var(--text-dark); display: flex; flex-direction: column; gap: 10px;">
                  <div>Email : <strong>${user.email}</strong></div>
                  <div>Téléphone : <strong>${user.phone}</strong></div>
                  <div>Rôle du compte : <span style="background: var(--bg-sand); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; color: var(--primary-deep);">${user.role.toUpperCase()}</span></div>
                  ${user.role === 'admin' ? `
                    <a href="#admin" class="btn btn-accent" style="margin-top: 15px; width: 100%; text-transform: none;">
                      <i class="fa-solid fa-screwdriver-wrench"></i> Accéder à la gestion Admin
                    </a>
                  ` : ''}
                </div>
              </div>
              
              <!-- Favoris -->
              <div style="background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                <h3 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 22px;">Mes Favoris</h3>
                <div>
                  ${favoritesHTML}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  init: function() {
    // Écouteur Login
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const pass = document.getElementById("login-password").value;

        const users = window.DB.getUsers();
        const found = users.find(u => u.email === email && u.password === pass);

        if (found) {
          window.App.setCurrentUser(found);
          window.App.showToast(`Bienvenue, ${found.firstName} !`);
          window.location.hash = "#account";
        } else {
          alert("Identifiants incorrects. Veuillez réessayer.");
        }
      });
    }

    // Écouteur Inscription
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const first = document.getElementById("signup-firstname").value.trim();
        const last = document.getElementById("signup-lastname").value.trim();
        const phone = document.getElementById("signup-phone").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const pass = document.getElementById("signup-password").value;

        // Validation téléphone Gabon
        if (!phone.startsWith("+241") && !/^(06|07)/.test(phone)) {
          alert("Veuillez entrer un numéro de téléphone gabonais valide (+241, 07 ou 06).");
          return;
        }

        const users = window.DB.getUsers();
        if (users.some(u => u.email === email)) {
          alert("Cet e-mail est déjà associé à un compte.");
          return;
        }

        const newUser = {
          email: email,
          password: pass,
          firstName: first,
          lastName: last,
          phone: phone,
          role: "client"
        };

        users.push(newUser);
        window.DB.saveUsers(users);
        window.App.setCurrentUser(newUser);
        window.App.showToast("Votre compte OcéanaShop a bien été créé !");
        window.location.hash = "#account";
      });
    }
  },

  logout: function() {
    window.App.setCurrentUser(null);
    window.App.showToast("Déconnexion réussie.");
    window.location.hash = "#home";
  },

  getStatusBgColor: function(status) {
    switch (status) {
      case 'Commande reçue': return '#EFF6FF';
      case 'Paiement confirmé': return '#ECFDF5';
      case 'En préparation': return '#FEF3C7';
      case 'En cours de livraison': return '#F3E8FF';
      case 'Livrée': return '#D1FAE5';
      default: return '#F3F4F6';
    }
  },

  getStatusTextColor: function(status) {
    switch (status) {
      case 'Commande reçue': return '#1D4ED8';
      case 'Paiement confirmé': return '#047857';
      case 'En préparation': return '#B45309';
      case 'En cours de livraison': return '#6B21A8';
      case 'Livrée': return '#065F46';
      default: return '#374151';
    }
  },

  printInvoice: function(orderId) {
    const orders = window.DB.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Créer une modale d'impression éphémère
    const printWindow = window.open('', '_blank');
    const itemsRows = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.reference})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} FCFA</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString()} FCFA</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Facture OcéanaShop - ${order.id}</title>
          <style>
            body { font-family: 'Outfit', 'Helvetica Neue', Arial, sans-serif; color: #333; margin: 30px; }
            .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .header-table td { vertical-align: top; }
            .logo { font-size: 28px; font-weight: 700; color: #0C3E26; }
            .slogan { font-size: 11px; color: #666; margin-top: -5px; }
            .invoice-title { font-size: 22px; color: #0C3E26; font-weight: 700; text-align: right; }
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .info-table td { width: 50%; font-size: 14px; line-height: 1.5; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th { background: #0C3E26; color: white; padding: 10px; text-align: left; font-size: 14px; }
            .totals-table { width: 40%; margin-left: 60%; border-collapse: collapse; font-size: 14px; }
            .totals-table td { padding: 8px 0; }
            .totals-table tr.grand-total { font-size: 18px; font-weight: 700; color: #0C3E26; border-top: 2px solid #0C3E26; }
            .footer-note { text-align: center; margin-top: 50px; font-size: 13px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table class="header-table">
              <tr>
                <td>
                  <span class="logo">OcéanaShop</span><br>
                  <span class="slogan">Le style qui vous accompagne.</span>
                </td>
                <td style="text-align: right;">
                  <span class="invoice-title">FACTURE</span><br>
                  <strong>N° : EG-2026-${order.id.split('-')[2]}</strong><br>
                  Date : ${order.date}<br>
                  Statut paiement : <strong>${order.paymentMethod === 'A la livraison' ? 'A régler à la livraison' : 'PAYÉ (Mobile Money)'}</strong>
                </td>
              </tr>
            </table>

            <table class="info-table">
              <tr>
                <td>
                  <strong>Émetteur :</strong><br>
                  OcéanaShop Gabon Inc.<br>
                  Quartier Louis, Libreville<br>
                  Téléphone : +241 077 00 00 00<br>
                  Email : facturation@oceanashop.ga
                </td>
                <td>
                  <strong>Destinataire :</strong><br>
                  ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                  Téléphone : ${order.shippingAddress.phone}<br>
                  Ville : ${order.shippingAddress.city} - Quartier : ${order.shippingAddress.quarter}<br>
                  Repère : ${order.shippingAddress.landmark || 'Non précisé'}
                </td>
              </tr>
            </table>

            <table class="items-table">
              <thead>
                <tr>
                  <th style="border-radius: 4px 0 0 4px;">Description du sac</th>
                  <th style="text-align: center;">Qté</th>
                  <th style="text-align: right;">Prix Unitaire</th>
                  <th style="border-radius: 0 4px 4px 0; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <table class="totals-table">
              <tr>
                <td>Sous-total :</td>
                <td style="text-align: right;">${order.subtotal.toLocaleString()} FCFA</td>
              </tr>
              ${order.discount > 0 ? `
              <tr>
                <td style="color: #EF4444;">Réduction (${order.couponCode}) :</td>
                <td style="text-align: right; color: #EF4444;">-${order.discount.toLocaleString()} FCFA</td>
              </tr>` : ''}
              <tr>
                <td>Livraison (${order.shippingMethod}) :</td>
                <td style="text-align: right;">${order.shippingCost.toLocaleString()} FCFA</td>
              </tr>
              <tr class="grand-total">
                <td>Total :</td>
                <td style="text-align: right;">${order.total.toLocaleString()} FCFA</td>
              </tr>
            </table>

            <div class="footer-note">
              <p>Merci pour votre confiance et votre achat chez <strong>OcéanaShop</strong>.</p>
              <p style="font-size: 11px; margin-top: 5px;">Document généré automatiquement. OcéanaShop Libreville - Enregistré au RCCM Gabon.</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

window.AccountPage = AccountPage;
