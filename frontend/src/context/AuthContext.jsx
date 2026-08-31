import React, { createContext, useContext, useState, useEffect } from 'react';
import { isRealFirebase, auth, db } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Prototype database of registered users in LocalStorage
  const [userDb, setUserDb] = useState(() => {
    const saved = localStorage.getItem('civicpulse_users_db');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        uid: 'user_citizen_1',
        name: 'John Doe',
        email: 'citizen@civicpulse.org',
        role: 'citizen',
        points: 250,
        assignedLocation: 'Ward 1 - Central Downtown',
        createdAt: new Date().toISOString()
      },
      {
        uid: 'admin_user_99',
        name: 'Admin Officer',
        email: 'admin@civicpulse.org',
        role: 'admin',
        points: 0,
        assignedLocation: 'Ward 1 - Central Downtown',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('civicpulse_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('civicpulse_users_db', JSON.stringify(userDb));
  }, [userDb]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('civicpulse_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('civicpulse_user');
    }
  }, [currentUser]);

  // Firebase Auth Listener
  useEffect(() => {
    if (!isRealFirebase || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const fbUser = { uid: user.uid, ...userDoc.data() };
            setCurrentUser(fbUser);
          }
        } catch (err) {
          console.warn("Firestore user fetch warning:", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Signup Handler
  const signup = async ({ name, email, password, role, secretCode, assignedLocation }) => {
    if (role === 'admin') {
      if (!secretCode || secretCode.trim() !== 'HackWarriors') {
        throw new Error('Invalid Secret Code for Admin Registration! Required: HackWarriors');
      }
    }

    const userData = {
      uid: 'user_' + Date.now(),
      name,
      email,
      role: role || 'citizen',
      points: role === 'admin' ? 0 : 100,
      assignedLocation: role === 'admin' ? (assignedLocation || 'Ward 1 - Central Downtown') : '',
      createdAt: new Date().toISOString()
    };

    if (isRealFirebase && auth) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        userData.uid = res.user.uid;
        try {
          await setDoc(doc(db, 'users', res.user.uid), userData);
        } catch (dbErr) {
          console.warn("Firestore setDoc warning:", dbErr);
        }
      } catch (fbErr) {
        if (fbErr.code === 'auth/configuration-not-found') {
          console.warn("⚠️ Firebase Email/Password Auth is not enabled in Firebase Console. Registering in prototype database.");
        } else {
          throw fbErr;
        }
      }
    }

    // Save to user database
    setUserDb(prev => [userData, ...prev.filter(u => u.email.toLowerCase() !== email.toLowerCase())]);
    return userData;
  };

  // Login Handler
  const login = async (email, password) => {
    if (isRealFirebase && auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        try {
          const userDoc = await getDoc(doc(db, 'users', res.user.uid));
          if (userDoc.exists()) {
            const u = { uid: res.user.uid, ...userDoc.data() };
            setCurrentUser(u);
            return u;
          }
        } catch (docErr) {
          console.warn("Firestore read warning:", docErr);
        }
      } catch (fbErr) {
        if (fbErr.code === 'auth/configuration-not-found') {
          console.warn("⚠️ Firebase Auth fallback to prototype database.");
        } else if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/wrong-password') {
          throw new Error('Invalid email or password in Firebase.');
        }
      }
    }

    // Lookup in local user database
    const matched = userDb.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (matched) {
      setCurrentUser(matched);
      return matched;
    }

    // If logging in with a new email not in db yet, create profile using their email name prefix
    const isEmpAdmin = email.toLowerCase().includes('admin');
    const inferredName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const fallbackUser = {
      uid: 'user_' + Date.now(),
      name: inferredName || (isEmpAdmin ? 'Admin Inspector' : 'Citizen User'),
      email,
      role: isEmpAdmin ? 'admin' : 'citizen',
      points: isEmpAdmin ? 0 : 100,
      assignedLocation: isEmpAdmin ? 'Ward 1 - Central Downtown' : '',
      createdAt: new Date().toISOString()
    };

    setUserDb(prev => [fallbackUser, ...prev]);
    setCurrentUser(fallbackUser);
    return fallbackUser;
  };

  // Logout Handler
  const logout = async () => {
    if (isRealFirebase && auth) {
      try { await signOut(auth); } catch (e) {}
    }
    setCurrentUser(null);
  };

  const addPoints = (amount) => {
    if (!currentUser || currentUser.role === 'admin') return;
    setCurrentUser(prev => {
      const updated = { ...prev, points: (prev.points || 0) + amount };
      localStorage.setItem('civicpulse_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout, addPoints, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
