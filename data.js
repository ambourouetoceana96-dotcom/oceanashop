// Données initiales et structure de stockage local pour OcéanaShop

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Sac Élégance Libreville",
    reference: "OS-SAC-LBV01",
    category: "sacs-a-main",
    price: 45000,
    oldPrice: 55000,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Le Sac Élégance Libreville incarne le luxe moderne pour la femme active gabonaise. Fabriqué en cuir premium texturé, il présente des finitions dorées raffinées et un intérieur spacieux avec des compartiments bien pensés pour votre smartphone, vos documents de travail et votre maquillage.",
    color: "Noir Ebène",
    material: "Cuir véritable",
    dimensions: "32cm x 24cm x 12cm",
    weight: "0.8 kg",
    stock: 5,
    rating: 4.8,
    reviewsCount: 12,
    badge: "Meilleure vente"
  },
  {
    id: 2,
    name: "Sac Bandoulière Akanda",
    reference: "OS-BDL-AKA02",
    category: "sacs-bandouliere",
    price: 28000,
    oldPrice: 32000,
    images: [
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc15a6a0?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Compact et chic, ce sac bandoulière est parfait pour vos sorties à Akanda ou vos balades en ville. Sa sangle ajustable en cuir et sa fermeture magnétique sécurisée vous garantissent un confort absolu tout en restant à la pointe de la mode.",
    color: "Vert Emeraude",
    material: "Cuir grainé",
    dimensions: "22cm x 15cm x 7cm",
    weight: "0.4 kg",
    stock: 8,
    rating: 4.5,
    reviewsCount: 8,
    badge: "Promotion"
  },
  {
    id: 3,
    name: "Sac Cabas Port-Gentil",
    reference: "OS-CAB-POG03",
    category: "sacs-cabas",
    price: 35000,
    oldPrice: null,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Inspiré par le dynamisme de Port-Gentil, ce cabas spacieux accueille tout votre univers. Idéal pour le travail, le shopping ou une escapade le week-end. Ses anses longues renforcées permettent un porté épaule très confortable.",
    color: "Beige Sable",
    material: "Toile de lin & Cuir",
    dimensions: "40cm x 30cm x 15cm",
    weight: "0.6 kg",
    stock: 12,
    rating: 4.9,
    reviewsCount: 15,
    badge: "Nouveauté"
  },
  {
    id: 4,
    name: "Pochette Émeraude Mayumba",
    reference: "OS-POC-MAY04",
    category: "pochettes",
    price: 18000,
    oldPrice: 24000,
    images: [
      "https://images.unsplash.com/photo-1524498250428-ec039683ac7c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Une pochette de soirée resplendissante aux tons vert profond et or. Parfaite pour briller lors des dîners de gala ou des réceptions élégantes à Libreville. Livrée avec une fine chaîne dorée amovible.",
    color: "Vert & Or",
    material: "Satin & Métal doré",
    dimensions: "20cm x 12cm x 4cm",
    weight: "0.3 kg",
    stock: 4,
    rating: 4.7,
    reviewsCount: 6,
    badge: "Collection du moment"
  },
  {
    id: 5,
    name: "Sac Prestige Gabon",
    reference: "OS-SAC-GAB05",
    category: "sacs-a-main",
    price: 65000,
    oldPrice: 75000,
    images: [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80"
    ],
    description: "La quintessence de l'artisanat de luxe. Fabriqué en édition limitée dans un cuir de veau pleine fleur exceptionnel. Orné d'un fermoir unique inspiré des lignes de l'art équatorial gabonais.",
    color: "Cognac",
    material: "Cuir de veau pleine fleur",
    dimensions: "28cm x 20cm x 10cm",
    weight: "0.9 kg",
    stock: 3,
    rating: 5.0,
    reviewsCount: 4,
    badge: "Édition Limitée"
  },
  {
    id: 6,
    name: "Mini-Sac Franceville",
    reference: "OS-MIN-FCV06",
    category: "mini-sacs",
    price: 22000,
    oldPrice: null,
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Petit par sa taille, immense par son style. Le Mini-sac Franceville suit la tendance micro-sac avec panache. Il accueille l'essentiel (téléphone, cartes, clé) avec une allure résolument moderne.",
    color: "Jaune Soleil",
    material: "Cuir végétalien",
    dimensions: "15cm x 11cm x 6cm",
    weight: "0.25 kg",
    stock: 15,
    rating: 4.4,
    reviewsCount: 7,
    badge: "Tendance"
  },
  {
    id: 7,
    name: "Sac de Travail Signature Owendo",
    reference: "OS-TRA-OWE07",
    category: "sacs-de-travail",
    price: 49000,
    oldPrice: 59000,
    images: [
      "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Pensé pour la femme d'affaires moderne d'Owendo et Libreville. Contient un compartiment matelassé pour ordinateur portable jusqu'à 13 pouces, des poches pour stylos et un passe-câble discret.",
    color: "Bleu Nuit",
    material: "Saffiano résistant",
    dimensions: "36cm x 28cm x 10cm",
    weight: "1.1 kg",
    stock: 6,
    rating: 4.6,
    reviewsCount: 9,
    badge: "Professionnel"
  },
  {
    id: 8,
    name: "Sac de Soirée Mayumba",
    reference: "OS-SOI-MAY08",
    category: "sacs-de-soiree",
    price: 25000,
    oldPrice: null,
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc15a6a0?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Un sac somptueux en velours de soie noir avec une magnifique poignée en perles nacrées synthétiques. Idéal pour sublimer vos tenues lors des plus belles célébrations au Gabon.",
    color: "Noir & Perles",
    material: "Velours de soie & Perles",
    dimensions: "18cm x 14cm x 8cm",
    weight: "0.35 kg",
    stock: 7,
    rating: 4.8,
    reviewsCount: 11,
    badge: "Populaire"
  },
  {
    id: 9,
    name: "Portefeuille Compact Océana",
    reference: "OS-ACC-WAL01",
    category: "accessoires",
    price: 12000,
    oldPrice: 15000,
    images: [
      "https://images.unsplash.com/photo-1627124765135-56c6020d5718?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Le compagnon idéal de votre sac à main. Ce portefeuille compact offre 6 fentes pour cartes, un compartiment zippé pour la monnaie et un emplacement dédié aux billets en FCFA.",
    color: "Beige Lux",
    material: "Cuir grainé",
    dimensions: "11cm x 9cm x 2cm",
    weight: "0.15 kg",
    stock: 20,
    rating: 4.7,
    reviewsCount: 14,
    badge: "Accessoire"
  },
  {
    id: 10,
    name: "Porte-cartes Ogooué",
    reference: "OS-ACC-CAR02",
    category: "accessoires",
    price: 7500,
    oldPrice: null,
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Porte-cartes ultra fin en cuir véritable. Se glisse discrètement dans toutes vos pochettes et mini-sacs. Permet de stocker jusqu'à 4 cartes bancaires et des reçus.",
    color: "Marron Forêt",
    material: "Cuir de chèvre",
    dimensions: "10cm x 7cm x 0.4cm",
    weight: "0.05 kg",
    stock: 25,
    rating: 4.3,
    reviewsCount: 5,
    badge: "Essentiel"
  }
];

const INITIAL_SHIPPING_ZONES = [
  { id: 1, city: "Libreville", zone: "Zone A (Centre, Batteria IV, Louis, Glass)", price: 1500, days: "1 jour (24h)" },
  { id: 2, city: "Libreville", zone: "Zone B (Charbonnages, Alibandeng, Angondjé)", price: 2000, days: "1 jour (24h)" },
  { id: 3, city: "Owendo", zone: "Zone Portuaire et environs", price: 2000, days: "1 jour (24h)" },
  { id: 4, city: "Akanda", zone: "Avorbam, Sablière, Cap Estérias", price: 2500, days: "1 jour (24h)" },
  { id: 5, city: "Ntoum", zone: "Centre et périphérie", price: 3500, days: "1-2 jours" },
  { id: 6, city: "Port-Gentil", zone: "Zone urbaine (Par avion/bateau)", price: 4000, days: "2-3 jours" },
  { id: 7, city: "Franceville", zone: "Envoi via agence de transport", price: 5000, days: "3-4 jours" },
  { id: 8, city: "Oyem", zone: "Envoi via agence de transport", price: 5000, days: "3-4 jours" },
  { id: 9, city: "Moanda", zone: "Envoi via agence de transport", price: 5000, days: "3-4 jours" },
  { id: 10, city: "Lambaréné", zone: "Envoi via agence", price: 4500, days: "2-3 jours" },
  { id: 11, city: "Mouila", zone: "Envoi via agence", price: 5000, days: "3-4 jours" },
  { id: 12, city: "Tchibanga", zone: "Envoi via agence", price: 6000, days: "4-5 jours" },
  { id: 13, city: "Koulamoutou", zone: "Envoi via agence", price: 6000, days: "4-5 jours" },
  { id: 14, city: "Makokou", zone: "Envoi via agence", price: 6000, days: "4-5 jours" }
];

const INITIAL_PROMO_CODES = [
  { code: "GABON20", type: "percent", value: 20, minAmount: 20000, description: "20% de réduction sur tout le site dès 20 000 FCFA d'achat" },
  { code: "OCEANA5000", type: "fixed", value: 5000, minAmount: 40000, description: "5000 FCFA de remise dès 40 000 FCFA d'achat" },
  { code: "BIENVENUE", type: "percent", value: 10, minAmount: 0, description: "10% de réduction de bienvenue sans minimum d'achat" }
];

const INITIAL_REVIEWS = [
  { productId: 1, author: "Marlyse N.", rating: 5, comment: "Absolument magnifique ! Le cuir est d'une qualité incroyable. Livré à Angondjé en moins de 24h. Je recommande OcéanaShop !", date: "2026-07-28" },
  { productId: 1, author: "Audrey M.", rating: 4, comment: "Très beau sac, très chic pour aller travailler au centre-ville. Les finitions dorées sont superbes.", date: "2026-07-29" },
  { productId: 2, author: "Tatiana K.", rating: 5, comment: "Couleur verte sublime ! Parfait pour le week-end. Très confortable à porter.", date: "2026-07-25" },
  { productId: 3, author: "Sandrine O.", rating: 5, comment: "Ce cabas est immense et solide. Je l'ai reçu par colis à Port-Gentil très rapidement. Super service client sur WhatsApp !", date: "2026-07-20" }
];

function initializeDatabase() {
  if (!localStorage.getItem("oceanashop_initialized")) {
    localStorage.setItem("oceanashop_products", JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem("oceanashop_shipping", JSON.stringify(INITIAL_SHIPPING_ZONES));
    localStorage.setItem("oceanashop_promos", JSON.stringify(INITIAL_PROMO_CODES));
    localStorage.setItem("oceanashop_reviews", JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem("oceanashop_orders", JSON.stringify([]));
    localStorage.setItem("oceanashop_users", JSON.stringify([
      {
        email: "admin@oceanashop.ga",
        password: "admin",
        firstName: "Admin",
        lastName: "OcéanaShop",
        phone: "+241 077000000",
        role: "admin"
      },
      {
        email: "client@test.ga",
        password: "password",
        firstName: "Sylvie",
        lastName: "Bongo",
        phone: "+241 066123456",
        role: "client"
      }
    ]));
    localStorage.setItem("oceanashop_initialized", "true");
  }
}

initializeDatabase();

const DB = {
  getProducts: () => JSON.parse(localStorage.getItem("oceanashop_products") || "[]"),
  saveProducts: (products) => localStorage.setItem("oceanashop_products", JSON.stringify(products)),
  getShippingZones: () => JSON.parse(localStorage.getItem("oceanashop_shipping") || "[]"),
  saveShippingZones: (zones) => localStorage.setItem("oceanashop_shipping", JSON.stringify(zones)),
  getPromoCodes: () => JSON.parse(localStorage.getItem("oceanashop_promos") || "[]"),
  savePromoCodes: (promos) => localStorage.setItem("oceanashop_promos", JSON.stringify(promos)),
  getReviews: () => JSON.parse(localStorage.getItem("oceanashop_reviews") || "[]"),
  saveReviews: (reviews) => localStorage.setItem("oceanashop_reviews", JSON.stringify(reviews)),
  getOrders: () => JSON.parse(localStorage.getItem("oceanashop_orders") || "[]"),
  saveOrders: (orders) => localStorage.setItem("oceanashop_orders", JSON.stringify(orders)),
  getUsers: () => JSON.parse(localStorage.getItem("oceanashop_users") || "[]"),
  saveUsers: (users) => localStorage.setItem("oceanashop_users", JSON.stringify(users))
};

window.DB = DB;
