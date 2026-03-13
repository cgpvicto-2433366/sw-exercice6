import pool from '../config/db.js'
import { adaptQuery, adaptResult } from '../config/queryadapters.js'

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
    const { query, params } = adaptQuery('SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon where id =?', [id]);

    try{
        const resultat = await pool.query(query, params);
        const rows = adaptResult(resultat);
        return rows[0];
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

    let sqlQuery;
    let sqlParams;

    if(type ===""){
        sqlQuery = `SELECT id, nom, type_primaire, type_secondaire, pv, attaque, defense, 
                (SELECT COUNT(*) FROM pokemon) AS "nombrePokemonTotal"
                FROM pokemon LIMIT ? OFFSET ?`;
        sqlParams = [limit, offset];
    }else {
        sqlQuery = `SELECT id, nom, type_primaire, type_secondaire, pv, attaque, defense, 
                    (SELECT COUNT(*) FROM pokemon WHERE type_primaire = ?) AS "nombrePokemonTotal"
                    FROM pokemon WHERE type_primaire = ? LIMIT ? OFFSET ?`;
        sqlParams = [type, type, limit, offset];
    }
    
    const { query, params } = adaptQuery(sqlQuery, sqlParams);
    
    try{
        const resultat = await pool.query(query, params);
        const adaptedResult = adaptResult(resultat);
        const total = adaptedResult.length > 0 ? adaptedResult[0].nombrePokemonTotal : 0;
        return [adaptedResult, total];
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
    const { query, params } = adaptQuery("INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES (?, ?, ?, ?, ?, ?)", [nom, type_primaire, type_secondaire, pv, attaque, defense]);

    try{
        const resultat = await pool.query(query, params);
        return adaptResult(resultat);
    }catch(erreur){
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
}


/**
 * Modifier un pokemon existant
 */
export const updateOnePokemon = async (id, nom, type_primaire, type_secondaire, pv, attaque, defense) => {
    const { query, params } = adaptQuery(`UPDATE pokemon 
                     SET nom = ?, type_primaire = ?, type_secondaire = ?, pv = ?, attaque = ?, defense = ? 
                     WHERE id = ?`, [nom, type_primaire, type_secondaire, pv, attaque, defense, id]);

    try {
        const resultat = await pool.query(query, params);
        return adaptResult(resultat);
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
}

/**
 * Supprimer un pokemon
 */
export const deleteOnePokemon = async (id) => {
    const { query, params } = adaptQuery("DELETE FROM pokemon WHERE id = ?", [id]);
    
    try {
        const resultat = await pool.query(query, params);
        return adaptResult(resultat);
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
}