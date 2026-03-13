// MongoDB Playground
// Script pour créer 25 produits avec le schéma spécifié

use("Exercice2-2");

// Supprimer la collection si elle existe
db.produits.drop();

// Variables pour les catégories et noms
const categories = ["info", "materiel", "logiciel", "accessoire", "reseau"];
const noms = [
  "Clavier", "Souris", "Moniteur", "Processeur", "Carte Mère",
  "RAM 8GB", "SSD 256GB", "Disque Dur 1TB", "Alimentation 500W", "Boîtier PC",
  "Hub USB", "Câble HDMI", "Câble Ethernet", "Ventilateur CPU", "Pâte Thermique",
  "Écran 27 pouces", "Imprimante", "Routeur WiFi", "Adaptateur USB-C", "Webcam",
  "Casque Audio", "Clé USB 32GB", "Manette Gaming", "Chargeur Rapide", "Batterie Externe"
];

// Insérer 25 produits
const produits = [];
for (let i = 1; i <= 25; i++) {
  const id = i;
  const nom = noms[i - 1];
  const cat = categories[(i - 1) % categories.length];
  const prix = Math.floor(Math.random() * 300) + 10; // Prix entre 10 et 310
  const notes = [
    Math.floor(Math.random() * 20),
    Math.floor(Math.random() * 20),
    Math.floor(Math.random() * 20)
  ];
  const stock = Math.floor(Math.random() * 100) + 5; // Stock entre 5 et 105
  
  produits.push({
    _id: id,
    nom: nom,
    cat: cat,
    prix: prix,
    notes: notes,
    stock: stock
  });
}

// Insérer tous les produits
db.produits.insertMany(produits);

// Afficher les produits insérés
db.produits.find();

