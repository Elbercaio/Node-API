const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({ 
        message: 'GET all Orders'})
});

router.get('/:order_id', (req, res, next) => {
    const id = req.params.order_id;
    res.status(200).send({ 
        message: `GET Order: ${id}`})
});

router.post('/:order_id', (req, res, next) => {
    const id = req.params.order_id;
    res.status(201).send({ 
        message: `POST Product: ${id}`})
});


router.delete('/:order_id', (req, res, next) => {
    const id = req.params.order_id;
    res.status(201).send({ 
        message: `DELETE Product: ${id}`})
});

module.exports = router;