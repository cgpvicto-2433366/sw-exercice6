/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Recuperer la liste de pokemon en groupe de 25, selon un type ou non
*
* page Integer Numéro de la page a retourné (optional)
* type String Type de pokémon a retourner (optional)
* returns _liste_get_200_response
* */
const listeGET = ({ page, type }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        page,
        type,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  listeGET,
};
