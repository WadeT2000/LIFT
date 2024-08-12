import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../App';

export default function Logout() {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    useEffect(() => {
        Cookies.remove('auth_token');
        Cookies.remove('username');
        Cookies.set('rememberMe', 'false'); 
        setAuth(false);
        navigate('/');
    }, [navigate, setAuth]);

    return null;
}