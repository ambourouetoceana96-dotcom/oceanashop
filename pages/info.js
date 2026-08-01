// Pages d'informations institutionnelles et de contact

const InfoPages = {
  // Rendu de la page À Propos
  renderAbout: function() {
    return `
      <section style="padding: 60px 0; background-color: var(--bg-white);">
        <div class="container" style="max-width: 800px;">
          <h1 class="section-title" style="margin-bottom: 20px;">À Propos d'OcéanaShop</h1>
          <p class="section-subtitle">Découvrez notre histoire, notre vision et nos engagements au Gabon.</p>
          
          <div style="margin-top: 40px; font-size: 16px; line-height: 1.8; color: var(--text-dark);">
            <p style="margin-bottom: 20px;">
              Fondée avec la passion d'offrir le meilleur de la maroquinerie moderne, <strong>OcéanaShop</strong> est devenue la référence gabonaise des sacs à main élégants pour femmes. Notre slogan, <strong>« Le style qui vous accompagne »</strong>, reflète notre volonté de proposer des accessoires à la fois pratiques, solides et d'un goût exquis pour chaque étape de votre journée.
            </p>
            <p style="margin-bottom: 20px;">
              Que vous habitiez à Libreville, Akanda, Port-Gentil, ou dans d'autres localités du Gabon, nous sélectionnons méticuleusement chaque pièce de notre collection. Nous travaillons pour rendre la haute couture et le design premium accessibles à toutes les femmes gabonaises, sans compromis sur la qualité de service.
            </p>
            <h3 style="color: var(--primary-deep); margin: 30px 0 15px; font-family: var(--font-title); font-size: 22px;">Nos Engagements</h3>
            <ul style="margin-left: 20px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
              <li><strong>Qualité Supérieure :</strong> Chaque matière, chaque fermeture éclair et chaque couture font l'objet d'un contrôle rigoureux.</li>
              <li><strong>Livraison Fiable au Gabon :</strong> Nous nous adaptons aux réalités locales avec des livreurs connaissant parfaitement Libreville et ses alentours, et des expéditions par agences fiables à l'intérieur du pays.</li>
              <li><strong>Proximité :</strong> Notre équipe est joignable directement par WhatsApp pour toute assistance rapide.</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  },

  // Rendu de la politique de livraison
  renderShippingPolicy: function() {
    const zones = window.DB.getShippingZones();
    let zonesHTML = zones.map(z => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color); font-weight: 600;">${z.city}</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${z.zone}</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color); font-weight: 700; color: var(--primary-deep);">${z.price.toLocaleString()} FCFA</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${z.days}</td>
      </tr>
    `).join('');

    return `
      <section style="padding: 60px 0;">
        <div class="container" style="max-width: 900px;">
          <h1 class="section-title">Politique & Tarifs de Livraison</h1>
          <p class="section-subtitle">Nous livrons chez vous ou en point relais partout au Gabon.</p>
          
          <div style="background: white; border-radius: var(--radius-md); padding: 30px; box-shadow: var(--shadow-sm); margin-top: 30px; overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="background-color: var(--primary-deep); color: white;">
                  <th style="padding: 12px; border-radius: 4px 0 0 4px;">Ville</th>
                  <th style="padding: 12px;">Zone / Quartier</th>
                  <th style="padding: 12px;">Tarif (FCFA)</th>
                  <th style="padding: 12px; border-radius: 0 4px 4px 0;">Délai</th>
                </tr>
              </thead>
              <tbody>
                ${zonesHTML}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 40px; font-size: 15px; color: var(--text-gray);">
            <p><strong>Note importante :</strong> Pour faciliter la livraison à domicile dans les quartiers de Libreville (ex: Alibandeng, Angondjé, Nzeng-Ayong), veuillez indiquer lors de la commande un lieu connu ou un point de repère précis (ex: "Pharmacie", "À côté du château d'eau").</p>
          </div>
        </div>
      </section>
    `;
  },

  // Rendu de la politique de retours
  renderReturnPolicy: function() {
    return `
      <section style="padding: 60px 0; background-color: var(--bg-white);">
        <div class="container" style="max-width: 800px;">
          <h1 class="section-title">Retours et Remboursements</h1>
          <p class="section-subtitle">Achetez en toute confiance chez OcéanaShop.</p>
          
          <div style="margin-top: 40px; line-height: 1.8;">
            <h3 style="color: var(--primary-deep); margin-bottom: 10px;">Conditions de Retour</h3>
            <p style="margin-bottom: 20px;">Vous disposez d'un délai de 48 heures après la réception de votre sac pour demander un échange ou un retour si le produit présente un défaut de fabrication ou ne correspond pas à vos attentes.</p>
            
            <h3 style="color: var(--primary-deep); margin-bottom: 10px;">Processus de Retour</h3>
            <p style="margin-bottom: 20px;">Pour effectuer un retour, veuillez contacter notre service client WhatsApp au +241 077000000 muni de votre numéro de commande (ex: CMD-2026-XXXX). Le produit doit être retourné dans son emballage d'origine, inutilisé.</p>
          </div>
        </div>
      </section>
    `;
  },

  // Rendu des conditions générales de vente
  renderTerms: function() {
    return `
      <section style="padding: 60px 0;">
        <div class="container" style="max-width: 800px;">
          <h1 class="section-title">Conditions Générales de Vente</h1>
          <p class="section-subtitle">Veuillez lire attentivement les CGV avant toute transaction.</p>
          
          <div style="margin-top: 40px; line-height: 1.8; color: var(--text-dark);">
            <h3 style="color: var(--primary-deep); margin-bottom: 10px;">1. Objet</h3>
            <p style="margin-bottom: 20px;">Les présentes conditions régissent les ventes de sacs à main et d'accessoires sur le site OcéanaShop au Gabon.</p>
            
            <h3 style="color: var(--primary-deep); margin-bottom: 10px;">2. Prix & Devise</h3>
            <p style="margin-bottom: 20px;">Les prix affichés sur OcéanaShop sont exprimés exclusivement en Franc CFA d'Afrique centrale (FCFA / XAF) et sont nets, hors frais de port.</p>

            <h3 style="color: var(--primary-deep); margin-bottom: 10px;">3. Paiement</h3>
            <p style="margin-bottom: 20px;">Le règlement de vos achats s'effectue via Airtel Money, Moov Money, Carte Bancaire ou directement en espèces à la livraison (pour les zones éligibles).</p>
          </div>
        </div>
      </section>
    `;
  },

  // Rendu de la page Contact
  renderContact: function() {
    return `
      <section style="padding: 60px 0;">
        <div class="container">
          <h1 class="section-title">Contactez-nous</h1>
          <p class="section-subtitle">Notre équipe est à votre écoute pour répondre à toutes vos questions.</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
            <!-- Formulaire -->
            <div style="background: white; border-radius: var(--radius-md); padding: 30px; box-shadow: var(--shadow-sm);">
              <h3 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title);">Envoyez-nous un message</h3>
              <form id="contact-form" style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-gray);">Nom complet</label>
                  <input type="text" placeholder="Ex: Marie-Louise Obiang" required style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                </div>
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-gray);">Adresse e-mail</label>
                  <input type="email" placeholder="Ex: marielouise@gmail.com" required style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                </div>
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-gray);">Téléphone (Gabon)</label>
                  <input type="tel" placeholder="Ex: +241 077 12 34 56" required style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                </div>
                <div>
                  <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: var(--text-gray);">Message</label>
                  <textarea rows="5" placeholder="Votre message..." required style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-family: inherit; resize: none;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Envoyer le message</button>
              </form>
            </div>
            
            <!-- Informations -->
            <div style="padding: 20px;">
              <h3 style="color: var(--primary-deep); margin-bottom: 20px; font-family: var(--font-title); font-size: 24px;">Nos Coordonnées</h3>
              <p style="margin-bottom: 30px; color: var(--text-gray);">Nous sommes basés à Libreville et effectuons les ventes exclusivement en ligne pour vous offrir les meilleurs prix.</p>
              
              <div style="display: flex; flex-direction: column; gap: 20px;">
                <div style="display: flex; gap: 15px; align-items: flex-start;">
                  <i class="fa-solid fa-location-dot" style="font-size: 20px; color: var(--accent-gold); margin-top: 4px;"></i>
                  <div>
                    <h4 style="font-size: 16px; color: var(--primary-deep);">Boutique & Dépôt</h4>
                    <p style="font-size: 14px; color: var(--text-gray);">Quartier Louis, Libreville, Gabon</p>
                  </div>
                </div>
                <div style="display: flex; gap: 15px; align-items: flex-start;">
                  <i class="fa-solid fa-phone" style="font-size: 20px; color: var(--accent-gold); margin-top: 4px;"></i>
                  <div>
                    <h4 style="font-size: 16px; color: var(--primary-deep);">Téléphone / WhatsApp</h4>
                    <p style="font-size: 14px; color: var(--text-gray);">+241 077 00 00 00 (Service Client)</p>
                  </div>
                </div>
                <div style="display: flex; gap: 15px; align-items: flex-start;">
                  <i class="fa-solid fa-envelope" style="font-size: 20px; color: var(--accent-gold); margin-top: 4px;"></i>
                  <div>
                    <h4 style="font-size: 16px; color: var(--primary-deep);">Adresse Mail</h4>
                    <p style="font-size: 14px; color: var(--text-gray);">contact@oceanashop.ga</p>
                  </div>
                </div>
              </div>

              <div style="margin-top: 40px; background-color: var(--bg-white); border-radius: var(--radius-md); padding: 20px; border-left: 4px solid var(--accent-gold);">
                <h4 style="color: var(--primary-deep); margin-bottom: 5px;">Besoin d'aide immédiate ?</h4>
                <p style="font-size: 14px; color: var(--text-gray); margin-bottom: 15px;">Échangez directement avec un conseiller commercial par WhatsApp.</p>
                <a href="https://wa.me/241077000000" target="_blank" class="btn btn-accent" style="text-transform: none; padding: 10px 20px;">
                  <i class="fa-brands fa-whatsapp" style="font-size: 18px;"></i> Discuter sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },
  
  initContact: function() {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        window.App.showToast("Votre message a bien été envoyé ! Nous vous répondrons rapidement.");
        contactForm.reset();
      });
    }
  }
};

window.InfoPages = InfoPages;
