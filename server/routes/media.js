const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    console.log('GET /api/media');
    db.query('SELECT * FROM media', (err, results) => {
        if (err) {
            console.error(' Erreur SQL:', err);
            return res.status(500).send(err);
        }
        console.log('Médias récupérés:', results.length);
        res.json(results);
    });
});

router.get('/type/:type', (req, res) => {
    const type = req.params.type;
    console.log('GET /api/media/type/' + type);
    db.query('SELECT * FROM media WHERE type = ?', [type], (err, results) => {
        if (err) {
            console.error(' Erreur SQL:', err);
            return res.status(500).send(err);
        }
        console.log('Médias trouvés:', results.length);
        res.json(results);
    });
});

router.get('/category/:id', (req, res) => {
    const id = req.params.id;
    console.log('GET /api/media/category/' + id);
    db.query('SELECT * FROM media WHERE category_id = ?', [id], (err, results) => {
        if (err) {
            console.error(' Erreur SQL:', err);
            return res.status(500).send(err);
        }
        console.log('Médias trouvés pour catégorie:', results.length);
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { title, type, year, description, image_url, category_id } = req.body;
    console.log('POST /api/media - Ajout:', title);
    
    if (!title || !type || !year || !description || !image_url || !category_id) {
        console.error(' Champs manquants');
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const sql = 'INSERT INTO media (title, type, year, description, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [title, type, year, description, image_url, category_id], (err, result) => {
        if (err) {
            console.error(' Erreur SQL ajout:', err);
            return res.status(500).send(err);
        }
        console.log('Média ajouté ID:', result.insertId);
        res.json({ id: result.insertId, ...req.body });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, type, year, description, image_url, category_id } = req.body;
    console.log('PUT /api/media/' + id + ' - Modification:', title);
    
    if (!title || !type || !year || !description || !image_url || !category_id) {
        console.error(' Champs manquants pour modification');
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const sql = 'UPDATE media SET title = ?, type = ?, year = ?, description = ?, image_url = ?, category_id = ? WHERE id = ?';
    db.query(sql, [title, type, year, description, image_url, category_id, id], (err, result) => {
        if (err) {
            console.error(' Erreur SQL modification:', err);
            return res.status(500).send(err);
        }

        if (result.affectedRows === 0) {
            console.error(' Média non trouvé pour modification');
            return res.status(404).json({ error: 'Média non trouvé' });
        }

        console.log('Média modifié avec succès');
        res.json({ id: parseInt(id), ...req.body });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log('DELETE /api/media/' + id);

    db.query('DELETE FROM media WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(' Erreur SQL suppression:', err);
            return res.status(500).send(err);
        }

        if (result.affectedRows === 0) {
            console.error('Média non trouvé pour suppression');
            return res.status(404).json({ error: 'Média non trouvé' });
        }

        console.log('Média supprimé avec succès');
        res.sendStatus(200);
    });
});

module.exports = router;