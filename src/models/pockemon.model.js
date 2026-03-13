import pool from '../config/db.js'

/**
 * Methode pour recuperer un pockemon dans la bd a partir 
 * de son identifiant
 *  
 * Format de reponse:
 * // Succès avec la route /api/pokemons/1
 * // Code de statut 200
 * {
 *      "nom":"Bulbasaur",
 *      "type_primaire":"Grass",
 *      "type_secondaire":"Poison",
 *      "pv":45,
 *      "attaque":49,
 *      "defense":49
 *  }
 *
 *  // Erreur : Le pokemon n'est pas trouvé
 *  // Code de statut 404
 *  {
 *      "erreur":"Pokemon introuvable avec l'id 1245"
 *  }
 *
 *  // Erreur : Il y a eu une erreur lors de la requête SQL 
 *  // Code de statut 500
 *  // Inscrivez à la console le code de statut SQL et le message d'erreur généré
 *  {
 *      "erreur":"Echec lors de la récupération du pokemon avec l'id 1245"
 *  }
 *
 * @param {} id // L'identifiant du pokemon à récupérer
 */
export const getOnePockemon = async (id) =>{
    const requete = 'SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon where id =?'
    const param = [id]

    try{
        const [resultat] = await pool.query(requete, param);
        return resultat[0] ?? null;
    } catch(erreur){
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
}


/**
 * Recuperer la liste total des pockemons en groupe de 25
 * en fonction ou non d'un type primaire specifique
 * @param {*} offset 
 * @param {*} limit 
 * @param {*} type 
 * @returns 
 */
export const getAllPokemons =  async(offset, limit, type) =>{

    let requete
    let params

    if(type ===""){
        requete = `SELECT id, nom, type_primaire, type_secondaire, pv, attaque, defense, 
                (SELECT COUNT(*) FROM pokemon) AS nombrePokemonTotal
                FROM pokemon LIMIT ? OFFSET ?`
        params = [limit, offset]
    }else {
        requete = `SELECT id, nom, type_primaire, type_secondaire, pv, attaque, defense, 
                    (SELECT COUNT(*) FROM pokemon WHERE type_primaire = ?) AS nombrePokemonTotal
                    FROM pokemon WHERE type_primaire = ? LIMIT ? OFFSET ?`
        params = [type, type, limit, offset]
    }
    
    try{
        const [resultat] = await pool.query(requete, params)
        const total = resultat.length > 0 ? resultat[0].nombrePokemonTotal: 0
        return [resultat, total]
    } catch(erreur){
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
}


/**
 * Ajouter un pockemon dans la base de donne
 * @param {*} nom 
 * @param {*} type_primaire 
 * @param {*} type_secondaire 
 * @param {*} pv 
 * @param {*} attaque 
 * @param {*} defense 
 * @returns 
 */
export const addOnePokemon =  async(nom, type_primaire, type_secondaire, pv, attaque, defense) =>{
    const requete =  "INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES (?, ?, ?, ?, ?, ?)"
    const params = [nom, type_primaire, type_secondaire, pv, attaque, defense]

    try{
        const [resultat] = await pool.execute(requete, params)
        return resultat
    }catch(erreur){
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
}


/**
 * Modifier un pokemon existant
 */
export const updateOnePokemon = async (id, nom, type_primaire, type_secondaire, pv, attaque, defense) => {
    const requete = `UPDATE pokemon 
                     SET nom = ?, type_primaire = ?, type_secondaire = ?, pv = ?, attaque = ?, defense = ? 
                     WHERE id = ?`;
    const params = [nom, type_primaire, type_secondaire, pv, attaque, defense, id];

    try {
        const [resultat] = await pool.execute(requete, params);
        return resultat;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
}

/**
 * Supprimer un pokemon
 */
export const deleteOnePokemon = async (id) => {
    const requete = "DELETE FROM pokemon WHERE id = ?";
    
    try {
        const [resultat] = await pool.execute(requete, [id]);
        return resultat;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
}