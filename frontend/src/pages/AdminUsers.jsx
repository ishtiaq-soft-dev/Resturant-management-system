import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        const result = await Swal.fire({
            title: 'Change User Role?',
            text: `Are you sure you want to make this user a ${newRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
                Swal.fire('Updated!', `User is now a ${newRole}.`, 'success');
                fetchUsers();
            } catch (err) {
                Swal.fire('Error', 'Failed to update role', 'error');
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading users...</div>;

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '900' }}>Manage Users</h1>

            <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem' }}>Username</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem' }}>{u.id}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.username}</td>
                                <td style={{ padding: '1rem' }}>{u.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        background: u.role === 'admin' ? '#E3F2FD' : '#F5F5F5',
                                        color: u.role === 'admin' ? '#1976D2' : '#616161'
                                    }}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => handleRoleUpdate(u.id, u.role)}
                                        style={{
                                            background: u.role === 'admin' ? '#ff9800' : 'var(--primary-color)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 15px',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
