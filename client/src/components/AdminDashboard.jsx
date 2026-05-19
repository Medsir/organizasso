import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/dashboard.css';

function AdminDashboard() {
    var [attenteUsers, setAttenteUsers] = useState([]);
    var [message, setMessage] = useState('');


    const loadAttenteUsers = () => {
        axios.get("http://localhost:3000/admin/attente", { withCredentials: true })
            .then((res) => {
                setAttenteUsers(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement admin :", err);
            });
    };

    useEffect(() => {
        loadAttenteUsers();
    }, []);


    const handleValidate = (id) => {
        axios.patch(`http://localhost:3000/admin/valider/${id}`, {}, { withCredentials: true })
            .then((res) => {
                setMessage(res.data.message);
                loadAttenteUsers(); 
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    setMessage(err.response.data.message);
                } else {
                    setMessage("Erreur lors de la validation.");
                }
            });
    };

    return (
        <div className="admin_dashboard">
            <h2>Tableau de bord Administrateur</h2>
            {message && <p>{message}</p>}
            
            {attenteUsers.length === 0 ? (
                <p>Aucune inscription en attente de validation.</p>
            ) : (
                <table className="admin_table">
                    <thead>
                        <tr>
                            <th>Pseudonyme</th>
                            <th>Email (Login)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attenteUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.userName}</td>
                                <td>{user.login}</td>
                                <td>
                                    <button className="btn_validate_user" onClick={() => handleValidate(user._id)}>
                                        Valider l'inscription
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminDashboard;