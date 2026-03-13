import express from 'express'
import { _getOnePockemon, _getAllPockemon, _addOnePokemon, _updateOnePokemon, _deleteOnePokemon } from '../controllers/pockemon.controller.js'

const router = express.Router()

router.get('/liste', _getAllPockemon)
router.get('/:id', _getOnePockemon)
router.post('/', _addOnePokemon )
router.put('/:id', _updateOnePokemon);   
router.delete('/:id', _deleteOnePokemon);

export default router