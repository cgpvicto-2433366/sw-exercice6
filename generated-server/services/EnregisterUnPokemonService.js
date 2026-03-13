/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Ajouter un pokemon dans la bd
*
* postRequest PostRequest 
* returns __post_201_response
* */
const rootPOST = ({ postRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postRequest,
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
  rootPOST,
};
