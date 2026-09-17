# Site immobilier — vente directe par le propriétaire

## Structure
```
index.html
style.css
script.js
/images/   → toutes les photos de la maison
/documents/ → DPE, diagnostics, plans, dossier de présentation (PDF)
```

## 1. Remplacer les informations

Ouvrez `index.html` et remplacez tous les textes entre crochets, par exemple :
- `[VILLE]`, `[REGION]`, `[PRIX]`
- `[SURFACE]`, `[TERRAIN]`, `[CHAMBRES]`
- `[DPE]`, `[GES]`
- `[EMAIL]`, `[TÉLÉPHONE]`, `[NUMERO WHATSAPP]` (format international sans le +, ex. 33612345678)
- `[ADRESSE OU VILLE]` dans l'URL de la carte Google Maps
- Les paragraphes `[Description...]`, `[Équipement...]`, etc.

Le fichier `script.js` contient aussi `[EMAIL]` dans la fonction d'envoi du formulaire — à remplacer par la vraie adresse.

## 2. Ajouter les photos

Déposez vos photos dans `/images/` avec exactement ces noms (ou modifiez les chemins dans `index.html`) :
- `hero.jpg` — photo principale (grand format, paysage, min. 1800px de large)
- `presentation.jpg`, `architecture.jpg`, `luminosite.jpg`, `exterieur.jpg`
- `gallery-exterieur.jpg`, `gallery-salon.jpg`, `gallery-cuisine.jpg`, `gallery-chambre1.jpg`, `gallery-sdb.jpg`, `gallery-jardin.jpg`, `gallery-autre1.jpg`, `gallery-autre2.jpg`

Conseils :
- Exportez vos photos en `.jpg`, qualité 80 %, largeur max. 2000 px pour un chargement rapide.
- Gardez des noms de fichiers cohérents avec ceux référencés dans `index.html`.
- Ajoutez des textes alternatifs (`alt="..."`) descriptifs et exacts sur chaque `<img>`.

## 3. Ajouter les documents

Placez vos fichiers PDF dans `/documents/` : `dpe.pdf`, `diagnostics.pdf`, `plans.pdf`, `dossier-presentation.pdf` (ou ajustez les noms dans `index.html`).

## 4. Formulaire de contact

Le formulaire prépare actuellement un e-mail pré-rempli (`mailto:`) à l'envoi. Pour recevoir les demandes directement dans une boîte de réception sans ouvrir le client mail du visiteur, vous pouvez brancher un service gratuit comme Formspree ou Netlify Forms : il suffit de remplacer la logique d'envoi dans `script.js` par un appel `fetch()` vers l'endpoint fourni par le service.

## 5. Héberger gratuitement sur GitHub Pages

1. Créez un nouveau dépôt GitHub (ex. `maison-a-vendre`).
2. Ajoutez-y les fichiers `index.html`, `style.css`, `script.js`, `/images/`, `/documents/`.
3. Dans les paramètres du dépôt → **Pages** → Source : branche `main`, dossier `/root`.
4. Le site sera publié à une adresse du type `https://votre-nom.github.io/maison-a-vendre/`.

## 6. Avant publication

- Vérifiez que toutes les distances et informations de localisation sont exactes (aucune n'a été inventée dans ce squelette).
- Testez le site sur mobile (menu, formulaire, galerie).
- Vérifiez les liens de téléchargement des documents.
- Remplacez le favicon si besoin (actuellement vide).
