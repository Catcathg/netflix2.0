import {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Home() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5001/api/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const Click = (id) => {
        navigate(`/category/${id}`);
    };

    const Edit = (e, category) => {
        e.stopPropagation();
        const newName = prompt('Nouveau nom de la catégorie:', category.name);
        if (newName && newName.trim()) {
            axios.put(`http://localhost:5001/api/categories/${category.id}`, {name: newName.trim()})
                .then(() => {
                    axios.get('http://localhost:5001/api/categories')
                        .then(res => setCategories(res.data));
                })
                .catch(err => {
                    console.error('Erreur lors de la modification:', err);
                    alert('Erreur lors de la modification');
                });
        }
    };

    const Delete = (e, category) => {
        e.stopPropagation();
        if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
            axios.delete(`http://localhost:5001/api/categories/${category.id}`)
                .then(() => {
                    setCategories(categories.filter(cat => cat.id !== category.id));
                })
                .catch(err => {
                    console.error('Erreur lors de la suppression:', err);
                    alert('Erreur lors de la suppression');
                });
        }
    };

    const AddCategory = () => {
        const newName = prompt('Nom de la nouvelle catégorie:');
        if (newName && newName.trim()) {
            axios.post('http://localhost:5001/api/categories', {name: newName.trim()})
                .then((res) => {
                    setCategories([...categories, res.data]);
                })
                .catch(err => {
                    console.error('Erreur lors de l\'ajout:', err);
                    alert('Erreur lors de l\'ajout');
                });
        }
    };

    return (
        <div style={{padding: '30px'}}>
            <h1 style={{color: 'blue'}}>Netflix2.0</h1>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                <h1>Choisissez une catégorie</h1>
                <button
                    onClick={AddCategory}
                    style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    + Ajouter une catégorie
                </button>
            </div>

            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => Click(cat.id)}
                        style={{
                            cursor: 'pointer',
                            border: '2px solid #333',
                            padding: '30px',
                            borderRadius: '10px',
                            width: '200px',
                            textAlign: 'center',
                            backgroundColor: '#f0f0f0',
                            transition: '0.3s',
                            position: 'relative'
                        }}
                    >
                        <h2>{cat.name}</h2>

                        {/* Boutons Modifier et Supprimer */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            display: 'flex',
                            gap: '5px'
                        }}>
                            <button
                                onClick={(e) => Edit(e, cat)}
                                style={{
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 8px',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                title="Modifier"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={(e) => Delete(e, cat)}
                                style={{
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 8px',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                title="Supprimer"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;