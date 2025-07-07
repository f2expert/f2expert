import { Navigate } from 'react-router-dom'

export default ({isAuthenticated, children}) =>  !isAuthenticated ? <Navigate to="/login" replace /> : children
