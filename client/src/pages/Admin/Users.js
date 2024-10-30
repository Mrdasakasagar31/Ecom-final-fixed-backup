// import React from 'react'
// import Layout from '../../components/Layout/Layout'
// import AdminMenu from '../../components/Layout/AdminMenu'
// import { useAuth } from "../../context/auth";
// const Users = () => {
//     const [auth] = useAuth();
//     return (

//         <Layout title={"Dashboard - All Users Details"}>
//             <div className="container-fluid p-3">
//                 <div className="row">
//                     <div className="col-lg-3 col-md-4">
//                         <AdminMenu />
//                     </div>
//                     <div className="col-lg-6 col-md-8 p-4">
//                         <h1 className="text-center ">Users Details</h1>
//                         <div className="card p-4">
//                             <h5>Name: {auth?.user?.name}</h5>
//                             <h6>Email: {auth?.user?.email}</h6>
//                             <h6>Address: {auth?.user?.address}</h6>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Layout>

//     )
// }
// export default Users

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth'; // Import your useAuth hook

const Users = () => {
    const [auth] = useAuth(); // Retrieve the auth context
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("https://ecom-final-fixed-backup.onrender.com/api/v1/auth/all-users", {
                    headers: {
                        Authorization: `Bearer ${auth.token}`, // Use auth.token here
                    },
                });
                setUsers(response.data.users);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Could not fetch users.');
            }
        };

        fetchUsers();
    }, [auth.token]); // Add auth.token as a dependency

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>All Users</h2>
            {users.map((user) => (
                <div key={user._id} className="user-card">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                </div>
            ))}
        </div>
    );
};

export default Users;
