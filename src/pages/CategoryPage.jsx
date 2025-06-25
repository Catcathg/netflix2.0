import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function CategoryPage() {
    const { id } = useParams();
    const [media, setMedia] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [editModal, setEditModal] = useState({ show: false, media: null });
    const [showAddForm, setShowAddForm] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        type: '',
        year: '',
        description: '',
        image_url: ''
    });
    const [addForm, setAddForm] = useState({
        title: '',
        type: 'film',
        year: new Date().getFullYear(),
        description: '',
        image_url: ''
    });

    useEffect(() => {
        loadMedia();
        loadCategoryName();
    }, [id]);

    const loadMedia = () => {
        axios.get(`http://localhost:5001/api/media/category/${id}`)
            .then(res => setMedia(res.data))
            .catch(err => console.error(err));
    };

    const loadCategoryName = () => {
        axios.get('http://localhost:5001/api/categories')
            .then(res => {
                const cat = res.data.find(c => c.id === parseInt(id));
                if (cat) setCategoryName(cat.name);
            });
    };

    const EditMedia = (mediaItem) => {
        setEditForm({
            title: mediaItem.title,
            type: mediaItem.type,
            year: mediaItem.year,
            description: mediaItem.description,
            image_url: mediaItem.image_url
        });
        setEditModal({ show: true, media: mediaItem });
    };

    const SubmitEdit = (e) => {
        e.preventDefault();
        const updatedMedia = {
            ...editForm,
            year: parseInt(editForm.year) || editForm.year,
            category_id: editModal.media.category_id
        };

        axios.put(`http://localhost:5001/api/media/${editModal.media.id}`, updatedMedia)
            .then(() => {
                loadMedia();
                setEditModal({ show: false, media: null });
            })
            .catch(err => {
                console.error('Erreur lors de la modification:', err);
                alert('Erreur lors de la modification');
            });
    };

    const CancelEdit = () => {
        setEditModal({ show: false, media: null });
    };

    const ShowAddForm = () => {
        setAddForm({
            title: '',
            type: 'film',
            year: new Date().getFullYear(),
            description: '',
            image_url: ''
        });
        setShowAddForm(true);
    };

    const SubmitAdd = (e) => {
        e.preventDefault();
        const newMedia = {
            ...addForm,
            year: parseInt(addForm.year) || new Date().getFullYear(),
            category_id: parseInt(id)
        };

        axios.post('http://localhost:5001/api/media', newMedia)
            .then((res) => {
                setMedia([...media, res.data]);
                setShowAddForm(false);
            })
            .catch(err => {
                console.error('Erreur lors de l\'ajout:', err);
                alert('Erreur lors de l\'ajout');
            });
    };

    const CancelAdd = () => {
        setShowAddForm(false);
    };

    const DeleteMedia = (mediaItem) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${mediaItem.title}" ?`)) {
            axios.delete(`http://localhost:5001/api/media/${mediaItem.id}`)
                .then(() => {
                    setMedia(media.filter(item => item.id !== mediaItem.id));
                })
                .catch(err => {
                    console.error('Erreur lors de la suppression:', err);
                    alert('Erreur lors de la suppression');
                });
        }
    };

    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        content: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
        },
        formGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold'
        },
        input: {
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
        },
        textarea: {
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            height: '80px',
            resize: 'vertical'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            marginTop: '20px'
        }
    };

    const buttonStyles = {
        cancel: {
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
        },
        primary: {
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
        }
    };

    const formStyles = {
        container: {
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid #dee2e6'
        },
        title: {
            marginBottom: '20px',
            color: '#333'
        },
        row: {
            display: 'flex',
            gap: '30px',
            marginBottom: '15px'
        },
        column: {
            flex: 1
        },
        fullWidth: {
            width: '100%'
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>
                ← Retour à l'accueil
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>{categoryName}</h1>
                <button
                    onClick={ShowAddForm}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    + Ajouter un média
                </button>
            </div>

            {/* Formulaire d'ajout intégré */}
            {showAddForm && (
                <div style={formStyles.container}>
                    <h2 style={formStyles.title}>Ajouter un nouveau média</h2>
                    <form onSubmit={SubmitAdd}>
                        <div style={formStyles.row}>
                            <div style={formStyles.column}>
                                <label style={modalStyles.label}>Titre :</label>
                                <input
                                    type="text"
                                    value={addForm.title}
                                    onChange={(e) => setAddForm({...addForm, title: e.target.value})}
                                    style={modalStyles.input}
                                    required
                                    placeholder="Entrez le titre du média"
                                />
                            </div>
                            <div style={formStyles.column}>
                                <label style={modalStyles.label}>Type :</label>
                                <select
                                    value={addForm.type}
                                    onChange={(e) => setAddForm({...addForm, type: e.target.value})}
                                    style={modalStyles.input}
                                    required
                                >
                                    <option value="film">Film</option>
                                    <option value="serie">Série</option>
                                </select>
                            </div>
                            <div style={formStyles.column}>
                                <label style={modalStyles.label}>Année :</label>
                                <input
                                    type="number"
                                    value={addForm.year}
                                    onChange={(e) => setAddForm({...addForm, year: e.target.value})}
                                    style={modalStyles.input}
                                    min="1900"
                                    max="2030"
                                    required
                                />
                            </div>
                        </div>

                        <div style={modalStyles.formGroup}>
                            <label style={modalStyles.label}>Description :</label>
                            <textarea
                                value={addForm.description}
                                onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                                style={modalStyles.textarea}
                                required
                                placeholder="Décrivez le média..."
                            />
                        </div>

                        <div style={modalStyles.formGroup}>
                            <label style={modalStyles.label}>URL de l'image :</label>
                            <input
                                type="url"
                                value={addForm.image_url}
                                onChange={(e) => setAddForm({...addForm, image_url: e.target.value})}
                                style={modalStyles.input}
                                required
                                placeholder="https://exemple.com/image.jpg"
                            />
                        </div>

                        <div style={modalStyles.buttonGroup}>
                            <button
                                type="button"
                                onClick={CancelAdd}
                                style={buttonStyles.cancel}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                style={buttonStyles.primary}
                            >
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {media.length === 0 ? (
                <p>Aucun contenu trouvé pour cette catégorie.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {media.map(item => (
                        <div
                            key={item.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                width: '250px',
                                padding: '10px',
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                position: 'relative'
                            }}
                        >
                            {/* Boutons Modifier et Supprimer */}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                display: 'flex',
                                gap: '5px',
                                zIndex: 1
                            }}>
                                <button
                                    onClick={() => EditMedia(item)}
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
                                    onClick={() => DeleteMedia(item)}
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

                            <img
                                src={item.image_url}
                                alt={item.title}
                                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                            />
                            <h3>{item.title}</h3>
                            <p><strong>{item.type}</strong> – {item.year}</p>
                            <p style={{ fontSize: '0.9em', color: '#555' }}>{item.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de modification */}
            {editModal.show && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.content}>
                        <h2>Modifier le média</h2>
                        <form onSubmit={SubmitEdit}>
                            <div style={modalStyles.formGroup}>
                                <label style={modalStyles.label}>Titre :</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    style={modalStyles.input}
                                    required
                                />
                            </div>

                            <div style={modalStyles.formGroup}>
                                <label style={modalStyles.label}>Type :</label>
                                <select
                                    value={editForm.type}
                                    onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                                    style={modalStyles.input}
                                    required
                                >
                                    <option value="film">Film</option>
                                    <option value="serie">Série</option>
                                </select>
                            </div>

                            <div style={modalStyles.formGroup}>
                                <label style={modalStyles.label}>Année :</label>
                                <input
                                    type="number"
                                    value={editForm.year}
                                    onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                                    style={modalStyles.input}
                                    min="1900"
                                    max="2030"
                                    required
                                />
                            </div>

                            <div style={modalStyles.formGroup}>
                                <label style={modalStyles.label}>Description :</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    style={modalStyles.textarea}
                                    required
                                />
                            </div>

                            <div style={modalStyles.formGroup}>
                                <label style={modalStyles.label}>URL de l'image :</label>
                                <input
                                    type="url"
                                    value={editForm.image_url}
                                    onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                                    style={modalStyles.input}
                                    required
                                />
                            </div>

                            <div style={modalStyles.buttonGroup}>
                                <button
                                    type="button"
                                    onClick={CancelEdit}
                                    style={buttonStyles.cancel}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    style={buttonStyles.primary}
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryPage;