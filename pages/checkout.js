// Tunnel de commande interactif 4 étapes - OcéanaShop Gabon

const CheckoutPage = {
  currentStep: 1,
  discount: 0,
  couponCode: '',
  shippingCost: 0,
  shippingDays: '',
  selectedZoneId: null,
  selectedPaymentMethod: 'Airtel Money',

  // Réinitialisation complète de l'état pour un nouvel achat
  reset: function() {
    this.currentStep = 1;
    this.discount = 0;
    this.couponCode = '';
    this.shippingCost = 0;
    this.shippingDays = '';
    this.selectedZoneId = null;
    this.selectedPaymentMethod = 'Airtel Money';
  },

  render: function() {
    const cart = window.App.getCart();
    if (cart.length === 0) {
      return `
        <div class="container" style="padding: 100px 20px; text-align: center;">
          <i class="fa-solid fa-cart-shopping" style="font-size: 56px; color: var(--text-light); margin-bottom: 20px;"></i>
          <h2 style="color: var(--primary-deep);">Votre panier est vide</h2>
          <p style="color: var(--text-gray); margin-top: 10px;">Ajoutez au moins un sac à main pour passer commande.</p>
          <a href="#shop" class="btn btn-primary" style="margin-top: 25px;">Retourner à la boutique</a>
        </div>
      `;
    }

    const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const total = subtotal - this.discount + this.shippingCost;

    const zones = window.DB.getShippingZones();
    let shippingOptionsHTML = zones.map(z => `
      <option value="${z.id}" ${this.selectedZoneId === z.id ? 'selected' : ''}>${z.city} - ${z.zone} (+${z.price.toLocaleString()} FCFA)</option>
    `).join('');

    let recapItemsHTML = cart.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
          <img src="${item.image}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; flex-shrink: 0;" alt="${item.name}">
          <span style="color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name} <strong style="color: var(--primary-deep);">×${item.quantity}</strong></span>
        </div>
        <span style="font-weight: 700; white-space: nowrap; color: var(--primary-deep);">${(item.price * item.quantity).toLocaleString()} FCFA</span>
      </div>
    `).join('');

    const user = window.App.getCurrentUser() || {};

    // Helper : couleur des indicateurs d'étape
    const stepBg = (n) => this.currentStep >= n ? 'var(--primary-deep)' : '#e2e8f0';
    const stepColor = (n) => this.currentStep >= n ? '#fff' : '#9ca3af';

    return `
      <section style="padding: 40px 0; background: var(--bg-sand);">
        <div class="container" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; align-items: start;">

          <!-- Zone principale : étapes -->
          <div style="background: white; padding: 35px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">

            <!-- Barre de progression -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 45px; position: relative; padding: 0 10px;">
              <div style="position: absolute; height: 3px; background: #e2e8f0; width: calc(100% - 60px); top: 16px; left: 30px; z-index: 1; border-radius: 2px;">
                <div style="height: 100%; background: var(--primary-deep); border-radius: 2px; width: ${((this.currentStep - 1) / 3) * 100}%; transition: width 0.4s ease;"></div>
              </div>
              ${[
                { n: 1, icon: 'fa-user', label: 'Identité' },
                { n: 2, icon: 'fa-map-marker-alt', label: 'Livraison' },
                { n: 3, icon: 'fa-wallet', label: 'Paiement' },
                { n: 4, icon: 'fa-check-circle', label: 'Confirmation' }
              ].map(s => `
                <div style="position: relative; z-index: 2; text-align: center; flex: 1;">
                  <div style="width: 34px; height: 34px; border-radius: 50%; background: ${stepBg(s.n)}; color: ${stepColor(s.n)}; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 14px; transition: all 0.3s ease; box-shadow: ${this.currentStep === s.n ? '0 0 0 4px rgba(12,62,38,0.12)' : 'none'};">
                    <i class="fa-solid ${s.icon}"></i>
                  </div>
                  <span style="font-size: 11px; font-weight: 600; color: ${this.currentStep >= s.n ? 'var(--primary-deep)' : '#9ca3af'}; text-transform: uppercase; letter-spacing: 0.5px;">${s.label}</span>
                </div>
              `).join('')}
            </div>

            <!-- ÉTAPE 1 : Informations client -->
            <div id="checkout-step-1" style="display: ${this.currentStep === 1 ? 'block' : 'none'};">
              <h3 style="color: var(--primary-deep); margin-bottom: 6px; font-family: var(--font-title); font-size: 22px;">Vos informations</h3>
              <p style="color: var(--text-gray); font-size: 14px; margin-bottom: 25px;">Ces informations serviront à préparer et confirmer votre commande.</p>

              <form id="checkout-form-1" style="display: flex; flex-direction: column; gap: 18px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div>
                    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-dark);">Prénom *</label>
                    <input type="text" id="chk-firstname" value="${user.firstName || ''}" required placeholder="Prénom" style="width: 100%; padding: 11px 14px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 14px; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--primary-deep)'" onblur="this.style.borderColor='var(--border-color)'">
                  </div>
                  <div>
                    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-dark);">Nom *</label>
                    <input type="text" id="chk-lastname" value="${user.lastName || ''}" required placeholder="Nom de famille" style="width: 100%; padding: 11px 14px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 14px; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--primary-deep)'" onblur="this.style.borderColor='var(--border-color)'">
                  </div>
                </div>
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-dark);">Téléphone gabonais (+241) *</label>
                  <div style="display: flex; gap: 0;">
                    <span style="padding: 11px 14px; background: var(--bg-sand); border: 1.5px solid var(--border-color); border-right: none; border-radius: var(--radius-sm) 0 0 var(--radius-sm); font-size: 14px; color: var(--text-gray); font-weight: 600; white-space: nowrap;">🇬🇦 +241</span>
                    <input type="tel" id="chk-phone" value="${(user.phone || '').replace('+241', '').trim()}" required placeholder="077 12 34 56" style="flex: 1; padding: 11px 14px; border: 1.5px solid var(--border-color); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 14px;" onfocus="this.style.borderColor='var(--primary-deep)'" onblur="this.style.borderColor='var(--border-color)'">
                  </div>
                </div>
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-dark);">Adresse e-mail *</label>
                  <input type="email" id="chk-email" value="${user.email || ''}" required placeholder="votre@email.com" style="width: 100%; padding: 11px 14px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 14px;" onfocus="this.style.borderColor='var(--primary-deep)'" onblur="this.style.borderColor='var(--border-color)'">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; height: 50px; font-size: 15px; letter-spacing: 0.5px;">
                  Continuer <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
                </button>
              </form>
            </div>

            <!-- ÉTAPE 2 : Livraison -->
            <div id="checkout-step-2" style="display: ${this.currentStep === 2 ? 'block' : 'none'};">
              <h3 style="color: var(--primary-deep); margin-bottom: 6px; font-family: var(--font-title); font-size: 22px;">Livraison au Gabon</h3>
              <p style="color: var(--text-gray); font-size: 14px; margin-bottom: 25px;">Choisissez votre ville et précisez votre adresse de livraison.</p>

              <form id="checkout-form-2" style="display: flex; flex-direction: column; gap: 18px;">
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-dark);">Ville / Zone de livraison *</label>
                  <select id="chk-shipping-zone" required style="width: 100%; padding: 11px 14px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 14px; background: white;">
                    <option value="">-- Sélectionnez votre ville --</option>
                    ${shippingOptionsHTML}
                  </select>
                </div>

                ${this.shippingCost > 0 ? `
                  <div style="background: #f0faf4; border: 1.5px solid #a7d9b9; padding: 14px 18px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 12px;">
                    <i class="fa-solid fa-truck-fast" style="font-size: 20px; color: var(--primary-deep);"></i>
                    <div>
                      <p style="font-weight: 700; color: var(--primary-deep); font-size: 14px;">Livraison : ${this.shippingCost.toLocaleString()} FCFA</p>
                      <p style="font-size: 12px; color: var(--text-gray);">Délai estimé : ${this.shippingDays}</p>
                    </div>
                  </div>
                ` : ''}

                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-dark);">Quartier *</label>
                  <input type="text" id="chk-quarter" placeholder="Ex: Nzeng-Ayong, Batterie IV, PK10..." required style="width: 100%; padding: 11px 14px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 14px;" onfocus="this.style.borderColor='var(--primary-deep)'" onblur="this.style.borderColor='var(--border-color)'">
                </div>

                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-dark);">
                    <i class="fa-solid fa-location-dot" style="color: var(--accent-gold);"></i> Point de repère (très important) *
                  </label>
                  <input type="text" id="chk-landmark" placeholder='Ex: "Près de la Pharmacie de la Paix" ou "Face au château d'eau"' required style="width: 100%; padding: 11px 14px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 14px;" onfocus="this.style.borderColor='var(--primary-deep)'" onblur="this.style.borderColor='var(--border-color)'">
                  <p style="font-size: 12px; color: var(--text-gray); margin-top: 5px;"><i class="fa-solid fa-circle-info"></i> Un lieu de repère précis garantit une livraison rapide et sans erreur.</p>
                </div>

                <div style="display: flex; gap: 12px;">
                  <button type="button" class="btn btn-outline" onclick="window.CheckoutPage.goToStep(1)" style="flex: 1; height: 50px;">
                    <i class="fa-solid fa-arrow-left"></i> Retour
                  </button>
                  <button type="submit" class="btn btn-primary" style="flex: 2; height: 50px;">
                    Continuer <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
                  </button>
                </div>
              </form>
            </div>

            <!-- ÉTAPE 3 : Mode de paiement -->
            <div id="checkout-step-3" style="display: ${this.currentStep === 3 ? 'block' : 'none'};">
              <h3 style="color: var(--primary-deep); margin-bottom: 6px; font-family: var(--font-title); font-size: 22px;">Mode de paiement</h3>
              <p style="color: var(--text-gray); font-size: 14px; margin-bottom: 25px;">Choisissez le moyen de paiement le plus pratique pour vous.</p>

              <form id="checkout-form-3" style="display: flex; flex-direction: column; gap: 15px;">
                <!-- Airtel Money -->
                <label id="lbl-airtel" style="border: 2px solid ${this.selectedPaymentMethod === 'Airtel Money' ? '#e11919' : 'var(--border-color)'}; padding: 18px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 15px; cursor: pointer; transition: all 0.2s; background: ${this.selectedPaymentMethod === 'Airtel Money' ? '#fff5f5' : 'white'};">
                  <input type="radio" name="payment-method" value="Airtel Money" ${this.selectedPaymentMethod === 'Airtel Money' ? 'checked' : ''} style="accent-color: #e11919; width: 18px; height: 18px;">
                  <div style="width: 46px; height: 46px; border-radius: 10px; background: linear-gradient(135deg, #cc0000, #ff3333); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="color: white; font-weight: 900; font-size: 13px; font-family: var(--font-body);">AM</span>
                  </div>
                  <div>
                    <strong style="color: #cc0000; font-size: 15px;">Airtel Money</strong>
                    <p style="font-size: 12px; color: var(--text-gray); margin-top: 2px;">Paiement instantané depuis votre compte Airtel Money Gabon</p>
                  </div>
                </label>

                <!-- Moov Money -->
                <label id="lbl-moov" style="border: 2px solid ${this.selectedPaymentMethod === 'Moov Money' ? '#005a9c' : 'var(--border-color)'}; padding: 18px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 15px; cursor: pointer; transition: all 0.2s; background: ${this.selectedPaymentMethod === 'Moov Money' ? '#f0f5ff' : 'white'};">
                  <input type="radio" name="payment-method" value="Moov Money" ${this.selectedPaymentMethod === 'Moov Money' ? 'checked' : ''} style="accent-color: #005a9c; width: 18px; height: 18px;">
                  <div style="width: 46px; height: 46px; border-radius: 10px; background: linear-gradient(135deg, #003d80, #0070cc); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="color: white; font-weight: 900; font-size: 13px; font-family: var(--font-body);">MM</span>
                  </div>
                  <div>
                    <strong style="color: #005a9c; font-size: 15px;">Moov Money</strong>
                    <p style="font-size: 12px; color: var(--text-gray); margin-top: 2px;">Paiement sécurisé depuis votre portefeuille Moov Money</p>
                  </div>
                </label>

                <!-- Cash livraison -->
                <label id="lbl-cash" style="border: 2px solid ${this.selectedPaymentMethod === 'A la livraison' ? 'var(--accent-gold)' : 'var(--border-color)'}; padding: 18px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 15px; cursor: pointer; transition: all 0.2s; background: ${this.selectedPaymentMethod === 'A la livraison' ? '#fffcee' : 'white'};">
                  <input type="radio" name="payment-method" value="A la livraison" ${this.selectedPaymentMethod === 'A la livraison' ? 'checked' : ''} style="accent-color: var(--accent-gold); width: 18px; height: 18px;">
                  <div style="width: 46px; height: 46px; border-radius: 10px; background: linear-gradient(135deg, #b8860b, #d4af37); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="fa-solid fa-money-bill-wave" style="color: white; font-size: 18px;"></i>
                  </div>
                  <div>
                    <strong style="color: #8a6400; font-size: 15px;">Paiement à la livraison</strong>
                    <p style="font-size: 12px; color: var(--text-gray); margin-top: 2px;">Réglez en espèces directement au livreur à la réception</p>
                  </div>
                </label>

                <div style="display: flex; gap: 12px; margin-top: 8px;">
                  <button type="button" class="btn btn-outline" onclick="window.CheckoutPage.goToStep(2)" style="flex: 1; height: 50px;">
                    <i class="fa-solid fa-arrow-left"></i> Retour
                  </button>
                  <button type="submit" class="btn btn-primary" style="flex: 2; height: 50px;">
                    Procéder au paiement <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
                  </button>
                </div>
              </form>
            </div>

            <!-- ÉTAPE 4 : Interface de paiement premium -->
            <div id="checkout-step-4" style="display: ${this.currentStep === 4 ? 'block' : 'none'};">
              <h3 style="color: var(--primary-deep); margin-bottom: 6px; font-family: var(--font-title); font-size: 22px;">Finaliser votre paiement</h3>
              <p style="color: var(--text-gray); font-size: 14px; margin-bottom: 25px;">Vérifiez les informations et confirmez votre paiement en toute sécurité.</p>

              <!-- Paiement Mobile Money (Airtel ou Moov) -->
              <div id="mobile-money-payment-box" style="display: ${this.selectedPaymentMethod !== 'A la livraison' ? 'block' : 'none'};">

                <!-- En-tête brandé selon l'opérateur -->
                <div id="mm-brand-header" style="border-radius: var(--radius-md) var(--radius-md) 0 0; padding: 24px 25px; background: ${this.selectedPaymentMethod === 'Airtel Money' ? 'linear-gradient(135deg, #cc0000 0%, #ff4444 100%)' : 'linear-gradient(135deg, #003d80 0%, #0070cc 100%)'}; color: white; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="width: 52px; height: 52px; border-radius: 12px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center;">
                      <i class="fa-solid fa-mobile-screen-button" style="font-size: 24px;"></i>
                    </div>
                    <div>
                      <p style="font-size: 12px; opacity: 0.85; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Paiement via</p>
                      <h4 style="font-size: 20px; font-weight: 700;">${this.selectedPaymentMethod}</h4>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <p style="font-size: 12px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Montant à payer</p>
                    <p style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">${total.toLocaleString()} <span style="font-size: 14px; font-weight: 500;">FCFA</span></p>
                  </div>
                </div>

                <!-- Formulaire de paiement -->
                <div style="border: 1.5px solid var(--border-color); border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md); padding: 25px; background: white; margin-bottom: 20px;">

                  <div style="margin-bottom: 18px;">
                    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-dark);">Numéro ${this.selectedPaymentMethod} *</label>
                    <div style="display: flex; gap: 0;">
                      <span style="padding: 11px 14px; background: var(--bg-sand); border: 1.5px solid var(--border-color); border-right: none; border-radius: var(--radius-sm) 0 0 var(--radius-sm); font-size: 14px; color: var(--text-gray); font-weight: 600;">🇬🇦 +241</span>
                      <input type="tel" id="mm-phone-number" placeholder="077 XX XX XX" maxlength="15" style="flex: 1; padding: 11px 14px; border: 1.5px solid var(--border-color); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
                    </div>
                    <p style="font-size: 12px; color: var(--text-gray); margin-top: 5px;">Entrez le numéro lié à votre compte ${this.selectedPaymentMethod}</p>
                  </div>

                  <!-- Résumé sécurisé -->
                  <div style="background: #f8fbf9; border: 1.5px solid #d1e8da; border-radius: var(--radius-sm); padding: 15px 18px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: var(--text-gray);">
                      <span>Boutique</span>
                      <strong style="color: var(--text-dark);">OcéanaShop Gabon</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: var(--text-gray);">
                      <span>Référence</span>
                      <strong style="color: var(--text-dark); font-family: monospace;">OS-${Date.now().toString().slice(-8)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: var(--primary-deep); border-top: 1px dashed #c8dfd0; padding-top: 10px; margin-top: 5px;">
                      <span>Total</span>
                      <span>${total.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px; font-size: 12px; color: var(--text-gray);">
                    <i class="fa-solid fa-shield-halved" style="color: var(--success); font-size: 16px;"></i>
                    Paiement 100% sécurisé. Vos données sont protégées et chiffrées.
                  </div>
                </div>
              </div>

              <!-- Paiement à la livraison -->
              <div id="cash-delivery-box" style="display: ${this.selectedPaymentMethod === 'A la livraison' ? 'block' : 'none'}; margin-bottom: 20px;">
                <div style="border: 2px solid var(--accent-gold); border-radius: var(--radius-md); overflow: hidden;">
                  <div style="background: linear-gradient(135deg, #b8860b, #d4af37); padding: 20px 25px; color: white; display: flex; align-items: center; gap: 15px;">
                    <i class="fa-solid fa-money-bill-wave" style="font-size: 30px; opacity: 0.9;"></i>
                    <div>
                      <h4 style="font-size: 18px; font-weight: 700;">Paiement à la livraison</h4>
                      <p style="font-size: 12px; opacity: 0.9; margin-top: 2px;">Règlement en espèces à la réception de votre colis</p>
                    </div>
                  </div>
                  <div style="background: #fffcee; padding: 20px 25px;">
                    <div style="display: flex; justify-content: space-between; font-size: 14px; color: var(--text-dark); margin-bottom: 10px;">
                      <span>Montant à préparer :</span>
                      <strong style="font-size: 18px; color: #7a5a00;">${total.toLocaleString()} FCFA</strong>
                    </div>
                    <p style="font-size: 13px; color: var(--text-gray); background: rgba(212,175,55,0.1); border-left: 3px solid var(--accent-gold); padding: 10px 14px; border-radius: 0 4px 4px 0;">
                      <i class="fa-solid fa-circle-info" style="color: var(--accent-gold);"></i> Veuillez préparer le montant exact en espèces pour faciliter l'échange avec notre livreur.
                    </p>
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 12px;">
                <button type="button" class="btn btn-outline" onclick="window.CheckoutPage.goToStep(3)" style="flex: 1; height: 50px;">
                  <i class="fa-solid fa-arrow-left"></i> Retour
                </button>
                <button type="button" id="btn-confirm-order" onclick="window.CheckoutPage.submitOrder()" class="btn btn-accent" style="flex: 2; height: 50px; font-size: 15px;">
                  <i class="fa-solid fa-lock" style="margin-right: 6px;"></i> Valider ma commande — ${total.toLocaleString()} FCFA
                </button>
              </div>
            </div>

          </div>

          <!-- Récapitulatif panier (sidebar) -->
          <aside style="background: white; padding: 25px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); position: sticky; top: 90px;">
            <h3 style="color: var(--primary-deep); margin-bottom: 18px; font-family: var(--font-title); font-size: 19px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
              Récapitulatif <span style="font-size: 13px; font-family: var(--font-body); color: var(--text-gray); font-weight: 400;">(${cart.length} article(s))</span>
            </h3>

            <div style="margin-bottom: 18px; max-height: 280px; overflow-y: auto;">
              ${recapItemsHTML}
            </div>

            <!-- Code Promo -->
            <div style="border-top: 1px solid var(--border-color); padding-top: 16px; margin-bottom: 16px;">
              <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-dark);">Code promotionnel</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="chk-coupon-input" value="${this.couponCode}" placeholder="Ex: GABON20" style="flex: 1; padding: 9px 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); text-transform: uppercase; font-size: 13px; font-weight: 600;">
                <button onclick="window.CheckoutPage.applyCoupon()" class="btn btn-outline" style="padding: 9px 14px; font-size: 12px; text-transform: none; white-space: nowrap;">Appliquer</button>
              </div>
              <div id="coupon-message" style="margin-top: 6px; font-size: 12px;"></div>
            </div>

            <!-- Totaux -->
            <div style="border-top: 1px dashed var(--border-color); padding-top: 14px; display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
              <div style="display: flex; justify-content: space-between; color: var(--text-gray);">
                <span>Sous-total</span>
                <span>${subtotal.toLocaleString()} FCFA</span>
              </div>
              ${this.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: var(--danger);">
                <span><i class="fa-solid fa-tag" style="font-size: 11px;"></i> Code ${this.couponCode}</span>
                <span>−${this.discount.toLocaleString()} FCFA</span>
              </div>` : ''}
              <div style="display: flex; justify-content: space-between; color: var(--text-gray);">
                <span>Livraison</span>
                <span>${this.shippingCost === 0 ? '<em style="color: var(--text-light);">À sélectionner</em>' : `${this.shippingCost.toLocaleString()} FCFA`}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 19px; color: var(--primary-deep); border-top: 2px solid var(--primary-deep); padding-top: 12px; margin-top: 4px;">
                <span>Total</span>
                <span>${total.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div style="margin-top: 20px; background: #f0faf4; border-radius: var(--radius-sm); padding: 12px 15px; font-size: 12px; color: var(--text-gray); text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <i class="fa-solid fa-shield-halved" style="color: var(--success); font-size: 16px;"></i>
              Paiement sécurisé · Facture PDF fournie
            </div>
          </aside>
        </div>
      </section>
    `;
  },

  init: function() {
    // Étape 1
    const form1 = document.getElementById("checkout-form-1");
    if (form1) {
      form1.addEventListener("submit", (e) => {
        e.preventDefault();
        this.goToStep(2);
      });
    }

    // Étape 2
    const form2 = document.getElementById("checkout-form-2");
    if (form2) {
      form2.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!this.selectedZoneId) {
          alert("Veuillez sélectionner une ville de livraison.");
          return;
        }
        this.goToStep(3);
      });
    }

    // Étape 3
    const form3 = document.getElementById("checkout-form-3");
    if (form3) {
      form3.addEventListener("submit", (e) => {
        e.preventDefault();
        const pMethod = document.querySelector('input[name="payment-method"]:checked').value;
        this.selectedPaymentMethod = pMethod;
        this.goToStep(4);
      });
    }

    // Sélection de zone de livraison
    const zoneSelect = document.getElementById("chk-shipping-zone");
    if (zoneSelect) {
      zoneSelect.addEventListener("change", (e) => {
        const zoneId = parseInt(e.target.value);
        this.selectedZoneId = zoneId;
        const zones = window.DB.getShippingZones();
        const selected = zones.find(z => z.id === zoneId);
        if (selected) {
          this.shippingCost = selected.price;
          this.shippingDays = selected.days;
        } else {
          this.shippingCost = 0;
          this.shippingDays = '';
        }
        const appNode = document.getElementById("app");
        appNode.innerHTML = this.render();
        this.init();
      });
    }

    // Radio paiement — mise à jour visuelle dynamique
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.selectedPaymentMethod = e.target.value;
        const appNode = document.getElementById("app");
        appNode.innerHTML = this.render();
        this.init();
      });
    });
  },

  goToStep: function(stepNum) {
    this.currentStep = stepNum;
    const appNode = document.getElementById("app");
    appNode.innerHTML = this.render();
    this.init();
    window.scrollTo(0, 0);
  },

  applyCoupon: function() {
    const couponVal = document.getElementById("chk-coupon-input").value.trim().toUpperCase();
    const promos = window.DB.getPromoCodes();
    const cart = window.App.getCart();
    const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const msgNode = document.getElementById("coupon-message");

    const found = promos.find(p => p.code === couponVal);

    if (found) {
      if (subtotal < found.minAmount) {
        msgNode.style.color = 'var(--danger)';
        msgNode.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Minimum de ${found.minAmount.toLocaleString()} FCFA requis.`;
        this.discount = 0;
        this.couponCode = '';
      } else {
        msgNode.style.color = 'var(--success)';
        msgNode.innerHTML = `<i class="fa-solid fa-circle-check"></i> Code appliqué ! ${found.description}`;
        this.discount = found.type === 'percent'
          ? Math.round(subtotal * (found.value / 100))
          : found.value;
        this.couponCode = found.code;
      }
    } else {
      msgNode.style.color = 'var(--danger)';
      msgNode.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Code promotionnel inconnu.`;
      this.discount = 0;
      this.couponCode = '';
    }

    const appNode = document.getElementById("app");
    appNode.innerHTML = this.render();
    this.init();
  },

  submitOrder: function() {
    // Validation du numéro Mobile Money si nécessaire
    if (this.selectedPaymentMethod !== 'A la livraison') {
      const mmPhone = document.getElementById("mm-phone-number");
      if (!mmPhone || !mmPhone.value.trim() || mmPhone.value.trim().length < 8) {
        alert(`Veuillez entrer votre numéro ${this.selectedPaymentMethod} valide pour confirmer le paiement.`);
        return;
      }
    }

    // Animation de traitement
    const confirmBtn = document.getElementById("btn-confirm-order");
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Traitement en cours...';
    }

    // Simulation d'un délai réseau (300ms) puis validation
    setTimeout(() => {
      const cart = window.App.getCart();
      const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      const total = subtotal - this.discount + this.shippingCost;

      const firstName = document.getElementById("chk-firstname")?.value || '';
      const lastName  = document.getElementById("chk-lastname")?.value  || '';
      const phone     = document.getElementById("chk-phone")?.value     || '';
      const email     = document.getElementById("chk-email")?.value     || '';

      const zoneSelect = document.getElementById("chk-shipping-zone");
      const zoneText = zoneSelect ? zoneSelect.options[zoneSelect.selectedIndex].text : 'Non précisé';
      const quarter  = document.getElementById("chk-quarter")?.value  || '';
      const landmark = document.getElementById("chk-landmark")?.value || '';

      const randNum = Math.floor(100000 + Math.random() * 900000);
      const orderId = `CMD-2026-${randNum}`;

      const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('fr-GA'),
        userEmail: email || 'guest@oceanashop.ga',
        items: cart,
        subtotal: subtotal,
        discount: this.discount,
        couponCode: this.couponCode,
        shippingCost: this.shippingCost,
        shippingMethod: zoneText.split(' - ')[0] + ' (' + this.shippingDays + ')',
        shippingAddress: { firstName, lastName, phone: '+241 ' + phone, city: zoneText.split(' - ')[0], quarter, landmark },
        paymentMethod: this.selectedPaymentMethod,
        total: total,
        status: "Commande reçue"
      };

      // Décrémenter les stocks
      const products = window.DB.getProducts();
      cart.forEach(ci => {
        const p = products.find(pr => pr.id === ci.id);
        if (p) p.stock = Math.max(0, p.stock - ci.quantity);
      });
      window.DB.saveProducts(products);

      // Sauvegarder la commande
      const orders = window.DB.getOrders();
      orders.unshift(newOrder);
      window.DB.saveOrders(orders);

      // Vider le panier
      window.App.clearCart();

      // Réinitialiser l'état du checkout pour le prochain achat
      this.reset();

      window.App.showToast("🎉 Commande validée ! Merci de votre confiance.");
      window.location.hash = `#order-tracking?id=${orderId}`;
    }, 300);
  }
};

window.CheckoutPage = CheckoutPage;
