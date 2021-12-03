const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({ 
        message: 'GET all Products'})
});

router.get('/:product_id', (req, res, next) => {
    const id = req.params.product_id;
    res.status(200).send({ 
        message: `GET Product: ${id}`})
});

router.post('/:product_id', (req, res, next) => {
    const id = req.params.product_id;
    res.status(201).send({ 
        message: `POST Product: ${id}`})
});

router.patch('/:product_id', (req, res, next) => {
    const id = req.params.product_id;
    res.status(201).send({ 
        message: `PATCH Product: ${id}`})
});

router.delete('/:product_id', (req, res, next) => {
    const id = req.params.product_id;
    res.status(201).send({ 
        message: `DELETE Product: ${id}`})
});

module.exports = router;