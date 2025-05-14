# TODOs à compléter dans le projet

## AuctionCard.tsx

- **Afficher le nombre d'enchères**
  ```typescript
  <Text style={styles.bidsCount}>
      {-1 /*#TODO*/} {-1 === 1 ? "enchère" : "enchères"}
  </Text>
  ```
  Contexte: Implémenter le comptage réel des enchères pour chaque article dans la carte d'enchère.

## ProfileScreen.tsx

- **Afficher la date d'inscription**
  ```typescript
  <Text style={styles.joinDate}>Membre depuis {formatDate(null)/*#TODO*/}</Text>
  ```
  Contexte: Remplacer `null` par la date d'inscription réelle de l'utilisateur.

- **Statistiques utilisateur**
  ```typescript
  // Compteur de ventes
  <Text style={styles.statValue}>{-1/*#TODO*/}</Text>
  
  // Compteur d'achats
  <Text style={styles.statValue}>{-1 /*#TODO*/}</Text>
  
  // Compteur d'enchères actives
  <Text style={styles.statValue}>{-1/*#TODO*/}</Text>
  
  // Compteur d'enchères gagnées
  <Text style={styles.statValue}>{-1 /*#TODO*/}</Text>
  ```
  Contexte: Implémenter les compteurs pour les statistiques utilisateur (ventes, achats, enchères actives et gagnées).

- **Réviser les styles**
  ```typescript
  /*#TODO*/
  const styles = StyleSheet.create({
  ```
  Contexte: Finaliser ou optimiser les styles de l'écran de profil.


## modification de l'api
  - [x] /auction/:id
    - [x] récupérer le nombre d'enchères par article
  - [x] user/:id
    - [x] count achats 
    - [x] count vendu
    - [x] count encours
  - [x] user/:id/getoffer
    - [x] filtre par (encours, vendu, acheté) 
  - [x] auction
    - [x] filtré par (toutes, encours, passées) algo de rating ?

  - search
    - recherche par mot clé
Endpoint pour obtenir la date d'inscription de l'utilisateur