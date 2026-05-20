import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/dashboard.css';

function AdminDashboard() {
    var [attenteUsers, setAttenteUsers] = useState([]);
    var [message, setMessage] = useState('');


    var [listeUsers, setListeUsers] = useState([]);


    const loadAttenteUsers = () => {
        axios.get("http://localhost:3000/admin/attente", { withCredentials: true })
            .then((res) => {
                setAttenteUsers(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement admin :", err);
            });
    };

    const loadUsers = ()=>{
        axios.get("http://localhost:3000/admin/userList", { withCredentials: true })
            .then((res) => {
                setListeUsers(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement admin :", err);
            });
    };

    useEffect(() => {
        loadAttenteUsers();
        loadUsers();
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


    const banUser = (id, event) =>{
        const confirmation =  confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
        if(confirmation === false){
            return;
        }
        axios.delete(`http://localhost:3000/user/${id}`, { withCredentials: true })
            .then((res) => {
                loadAttenteUsers();
                loadUsers();
            })
            .catch((err) => {
                console.log(err);
            });
    }


    const promoteUser = (id) => {
        axios.patch(`http://localhost:3000/admin/promote/${id}`, {}, { withCredentials: true })
            .then((res) => {
                loadAttenteUsers(); 
                loadUsers();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
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

        <div className="admin_dashboard">
            <h2>Liste des Membres</h2>
            {message && <p>{message}</p>}
            
            {listeUsers.length === 0 ? (
                <p>Aucun utilisateur</p>
            ) : (
                <table className="admin_table">
                    <thead>
                        <tr>
                            <th>Pseudonyme</th>
                            <th>Email (Login)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listeUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.userName}</td>
                                <td>{user.login}</td>
                                <td>
                                    {user.status == "Admin" ?  <button className="deja_admin" disabled>Déjà admin</button> : <button className="btn_validate_user" onClick={() => promoteUser(user._id)}>Promouvoir</button>}
                                    {user.status != "Admin" ? <button className="ban_user_btn" onClick={(e) => banUser(user._id, e)}> Bannir ⛔ </button> : <button className="ban_user_btn" disabled> Saluer 👋 </button> }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        </>
    );
}

export default AdminDashboard;