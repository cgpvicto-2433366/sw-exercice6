import { getOnePockemon, getAllPokemons, addOnePokemon, updateOnePokemon, deleteOnePokemon } from "../models/pockemon.model.js";

export const _getOnePockemon = async (req, res) =>{
    const param = req.params.id;

    // Teste si le paramètre id est présent et valide
    if(!param|| parseInt(param) <= 0){
        res.status(400);
        res.send({
            message: "L'identifiant du pockemon est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    try {
        const pockemon = await getOnePockemon(param);
        // Pockemon non trouvé
        if(!pockemon){
            res.status(404).json({ "erreur":"Pokemon introuvable avec l'id "+param })
            return;
        }
        //Pockemon trouvé
        res.json(pockemon);

    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            "erreur":"Echec lors de la récupération du pokemon avec l'id "+ param
        });
    }
}

/**
 * Recuperer la liste des pockemons en groupes de 25
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _getAllPockemon = async (req, res) =>{
    let page = req.query.page
    const type = req.query.type || ""
    const limit = 25

    //validation du parametre page
    if(page){
        if(parseInt(page)>=1){
            page = parseInt(page)
        }
        else{
            res.status(400);
            res.send({
                message: "La page spécifiée n'est pas valide."
            });
            return;
        }
    }else{
        page = 1
    }

    const offset = (page - 1)*limit;

    try {
        const pokemons = await getAllPokemons(offset, limit, type);
        const liste = pokemons[0];
        const total = pokemons[1];

        // -----------------------------
        // CAS : Pokémon non trouvés
        // -----------------------------
        if(liste.length == 0){
            return res.status(404).json({
                "pokemons": [],
                "type": type,
                "nombrePokemonTotal": 0,
                "page": page,
                "totalPage": 1
            })
        }
        
        // -----------------------------
        // CAS : Pokémon trouvés
        // -----------------------------
        return res.json({
            pokemons: liste,
            type: type,
            nombrePokemonTotal: total,
            page: page,
            totalPage: Math.ceil(total / limit)
        });

    } catch (erreur) {
        console.log('Erreur SQL : ', erreur.code, erreur.sqlMessage);
        res.status(500).json({
            erreur: "Echec lors de la récupération de la liste des pokemons"
        });
    }
}

/**
 * Ajouter un pockemeon
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _addOnePokemon = async (req, res) => {
    const requiredFields = ["nom", "type_primaire", "type_secondaire", "pv", "attaque", "defense"];
    const nouveau = req.body;

    // Vérifier les champs manquants
    const champsManquants = requiredFields.filter(f => !(f in nouveau));
    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: "Format de données invalide",
            manquants: champsManquants
        });
    }

    // Vérifier que les champs obligatoires ne sont pas vides
    let champsVides = [];
    for (let i = 0; i < 3; i++) {
        if (nouveau[requiredFields[i]] === "") {
            champsVides.push(requiredFields[i]);
        }
    }

    if (champsVides.length > 0) {
        return res.status(400).json({
            erreur: "Champs obligatoires manquants ou vides",
            manquants: champsVides
        });
    }

    // Conversion des valeurs numériques
    const pv = parseInt(nouveau.pv);
    const attaque = parseInt(nouveau.attaque);
    const defense = parseInt(nouveau.defense);

    // Vérifier que ce sont bien des nombres
    let invalides = [];
    if(isNaN(pv)){
        invalides.push(pv)
    }
    if(isNaN(attaque)){
        invalides.push(attaque)
    }
    if(isNaN(defense)){
        invalides.push(defense)
    }

    if (invalides.length > 0) {
        return res.status(400).json({
            erreur: "Les champs suivants doivent être des nombres",
            invalides
        });
    }

    const nom = nouveau.nom;
    const type_primaire = nouveau.type_primaire;
    const type_secondaire = nouveau.type_secondaire;

    try {
        const reponse = await addOnePokemon(nom, type_primaire, type_secondaire, pv, attaque, defense);

        res.status(201).json({
            message: "Le pokemon " + nom + " a été ajouté avec succès",
            pokemon: {
                id: reponse.insertId,
                nom,
                type_primaire,
                type_secondaire,
                pv,
                attaque,
                defense
            }
        });

    } catch (error) {
        console.log("Erreur SQL :", error.code, error.sqlMessage);
        res.status(500).json({
            erreur: "Échec lors de la création du pokemon " + nom
        });
    }
};


/**
 * Modifier un pokemon
 */
export const _updateOnePokemon = async (req, res) => {
    const id = req.params.id;
    const requiredFields = ["nom", "type_primaire", "type_secondaire", "pv", "attaque", "defense"];
    const donnees = req.body;

    // 1. Vérifier si le format JSON est valide (champs présents)
    const champsManquants = requiredFields.filter(f => !(f in donnees));
    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champs_manquants: champsManquants
        });
    }

    try {
        // 2. Vérifier si le Pokémon existe
        const pokemonExistant = await getOnePockemon(id);
        if (!pokemonExistant) {
            return res.status(404).json({
                erreur: `Le pokemon id ${id} n'existe pas dans la base de données`
            });
        }

        // 3. Exécuter la modification
        const { nom, type_primaire, type_secondaire, pv, attaque, defense } = donnees;
        await updateOnePokemon(id, nom, type_primaire, type_secondaire, pv, attaque, defense);

        res.status(200).json({
            message: `Le pokemon id ${id} a été modifié avec succès`
        });

    } catch (error) {
        res.status(500).json({
            erreur: `Echec lors de la modification du pokemon ${donnees.nom}`
        });
    }
};

/**
 * Supprimer un pokemon
 */
export const _deleteOnePokemon = async (req, res) => {
    const id = req.params.id;

    try {
        // 1. Vérifier si le Pokémon existe (et récupérer son nom pour le message d'erreur SQL au cas où)
        const pokemon = await getOnePockemon(id);
        if (!pokemon) {
            return res.status(404).json({
                erreur: `Le pokemon id ${id} n'existe pas dans la base de données`
            });
        }

        // 2. Supprimer
        await deleteOnePokemon(id);

        res.status(200).json({
            message: `Le pokemon id ${id} a été supprimé avec succès`
        });

    } catch (error) {
        // Ici on utilise le nom récupéré avant la suppression pour le message
        res.status(500).json({
            erreur: `Echec lors de la suppression du pokemon`
        });
    }
};