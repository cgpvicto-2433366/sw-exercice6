/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Supprimer un pokemon de la base de données
*
* id Integer Identifiant du pokemon à supprimer
* returns __id__delete_200_response
* */
const idDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Recuperer les informations sur un pokemon en fonction de son id
*
* id Integer Identifiant du pockemon dans la base de donnée
* returns __id__get_200_response
* */
const idGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Modifier un pokemon existant en fonction de son id
*
* id Integer Identifiant du pokemon à modifier
* idPutRequest IdPutRequest 
* returns __id__put_200_response
* */
const idPUT = ({ id, idPutRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        idPutRequest,
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
  idDELETE,
  idGET,
  idPUT,
};
