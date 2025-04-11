import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create a custom hook for using the context
function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// AuthProvider component
function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on page load
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setCurrentUser(userData);
                    } else {
                        // Token invalid or expired
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    localStorage.removeItem('token');
                }
            }

            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (emailOrUsername, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailOrUsername,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setCurrentUser(data.user);
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Export both the provider component and the hook
export { AuthProvider, useAuth };