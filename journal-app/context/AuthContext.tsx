import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextProps {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    user: User | null;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

function useProtectedRoute(user: User | null) {
    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (!navigationState?.key) return;

        const inAuthGroup = segments[0] === '(auth)';
        
        if (user && inAuthGroup) {
            // If user is logged in and in auth group, redirect to home
            router.replace('/(tabs)/');
        } else if (!user && !inAuthGroup && segments[0] !== undefined) {
            // If no user and not in auth group, redirect to sign in
            router.replace('/(auth)/sign-in');
        }
    }, [user, segments, navigationState?.key]);
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useProtectedRoute(user);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data?.session?.user || null);
            setLoading(false);
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user || null);
            setLoading(false);

            if (event === 'SIGNED_IN') {
                router.replace('/(tabs)/');
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [router]);

    const value: AuthContextProps = {
        signIn: async (email, password) => {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        },
        signUp: async (email, password) => {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
        },
        signOut: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace('/(auth)/sign-in');
        },
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : null}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};