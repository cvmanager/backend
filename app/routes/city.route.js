import express from 'express'
import CityValidation from '../validators/city.validation.js'
import CityController from '../http/controllers/city.controller.js'

const cityRouter = express.Router();

cityRouter
    .get('/', CityValidation.index(), CityController.index)
    .get('/:id', CityValidation.find(), CityController.find)

export default cityRouter;