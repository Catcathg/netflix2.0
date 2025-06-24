const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    console.log('GET /api/categories');
    db.query('SELECT * FROM categories ORDER BY name', (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send(err);
        }
        console.log('Catégories récupérées:', results.length);
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    console.log('GET /api/categories/' + id);

    db.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            console.error('Catégorie non trouvée');
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }

        console.log('Catégorie trouvée:', results[0].name);
        res.json(results[0]);
    });
});

router.post('/', (req, res) => {
    const { name } = req.body;
    console.log('➕ POST /api/categories - Ajout:', name);

    if (!name || !name.trim()) {
        console.error('Nom de catégorie manquant');
        return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }

    const sql = 'INSERT INTO categories (name) VALUES (?)';
    db.query(sql, [name.trim()], (err, result) => {
        if (err) {
            console.error('Erreur SQL ajout:', err);
            return res.status(500).send(err);
        }
        console.log('Catégorie ajoutée ID:', result.insertId);
        res.json({ id: result.insertId, name: name.trim() });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    console.log('PUT /api/categories/' + id + ' - Modification:', name);
    
    if (!name || !name.trim()) {
        console.error('Nom de catégorie manquant pour modification');
        return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }

    const sql = 'UPDATE categories SET name = ? WHERE id = ?';
    db.query(sql, [name.trim(), id], (err, result) => {
        if (err) {
            console.error('Erreur SQL modification:', err);
            return res.status(500).send(err);
        }

        if (result.affectedRows === 0) {
            console.error('Catégorie non trouvée pour modification');
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }

        console.log('Catégorie modifiée avec succès');
        res.json({ id: parseInt(id), name: name.trim() });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log('DELETE /api/categories/' + id);
    
    db.query('SELECT COUNT(*) as count FROM media WHERE category_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur SQL vérification:', err);
            return res.status(500).send(err);
        }

        const mediaCount = results[0].count;
        if (mediaCount > 0) {
            console.error('Impossible de supprimer: catégorie contient des médias');
            return res.status(400).json({
                error: `Impossible de supprimer cette catégorie car elle contient ${mediaCount} média(s). Veuillez d'abord supprimer ou déplacer les médias.`
            });
        }
        
        db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error('Erreur SQL suppression:', err);
                return res.status(500).send(err);
            }

            if (result.affectedRows === 0) {
                console.error('Catégorie non trouvée pour suppression');
                return res.status(404).json({ error: 'Catégorie non trouvée' });
            }

            console.log('Catégorie supprimée avec succès');
            res.sendStatus(200);
        });
    });
});

module.exports = router;