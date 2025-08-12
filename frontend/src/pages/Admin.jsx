import React from 'react'
import { Link } from 'react-router-dom'

function Admin() {
  return (
    <>
    <header>
        <Link to="/admin/users" className="btn btn-reverse" />

        <div>
            <h1>Admin Dashboard</h1>

            <div className="admin-links">
                
            </div>
        </div>
    </header>
    </>
  )
}

export default Admin