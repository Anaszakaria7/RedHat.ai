/* ═══════════════════════════════════════════
   RedHat.AI — Firebase Configuration
   ═══════════════════════════════════════════ */

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5nJVBAaag6e0jlLHrMnEn6QU7s1Xmgjk",
  authDomain: "redhat-ai-f89ff.firebaseapp.com",
  projectId: "redhat-ai-f89ff",
  storageBucket: "redhat-ai-f89ff.firebasestorage.app",
  messagingSenderId: "644920268389",
  appId: "1:644920268389:web:213f0a059aa33374de588c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ═══════════════════════════════════════════
// AUTH FUNCTIONS
// ═══════════════════════════════════════════

/**
 * Register new user with email & password
 * Saves user profile to Firestore
 */
async function registerUser(email, password, firstName, lastName) {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional profile data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      displayName: `${firstName} ${lastName}`,
      createdAt: serverTimestamp(),
      plan: "FREE",
      role: "trader"
    });

    // Save to localStorage for quick access
    localStorage.setItem("redhat_user", JSON.stringify({
      uid: user.uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      displayName: `${firstName} ${lastName}`,
      plan: "FREE"
    }));

    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Login user with email & password
 */
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    // Save to localStorage
    localStorage.setItem("redhat_user", JSON.stringify({
      uid: user.uid,
      email: user.email,
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      displayName: userData?.displayName || user.email,
      plan: userData?.plan || "FREE"
    }));

    return { success: true, user: user, data: userData };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Login with Google
 */
async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists, if not create it
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      const names = user.displayName?.split(" ") || ["", ""];
      await setDoc(doc(db, "users", user.uid), {
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: user.email,
        displayName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        plan: "FREE",
        role: "trader"
      });
    }

    const userData = userDoc.data() || {};
    localStorage.setItem("redhat_user", JSON.stringify({
      uid: user.uid,
      email: user.email,
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      displayName: user.displayName || user.email,
      plan: userData?.plan || "FREE"
    }));

    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Logout current user
 */
async function logoutUser() {
  try {
    await signOut(auth);
    localStorage.removeItem("redhat_user");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get current user data from localStorage
 */
function getCurrentUser() {
  const data = localStorage.getItem("redhat_user");
  return data ? JSON.parse(data) : null;
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
  return getCurrentUser() !== null;
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
  if (!isLoggedIn() && !auth.currentUser) {
    window.location.href = "signup.html";
  }
}

/**
 * Redirect to home if already logged in
 */
function redirectIfLoggedIn() {
  if (isLoggedIn() || auth.currentUser) {
    window.location.href = "home.html";
  }
}

// ═══════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════

/**
 * Convert Firebase error codes to user-friendly messages (BM)
 */
function getErrorMessage(code) {
  const messages = {
    "auth/email-already-in-use": "Emel ini sudah digunakan. Sila guna emel lain atau log masuk.",
    "auth/invalid-email": "Format emel tidak sah.",
    "auth/weak-password": "Kata laluan terlalu lemah. Minimum 8 aksara.",
    "auth/user-not-found": "Akaun tidak dijumpai. Sila daftar terlebih dahulu.",
    "auth/wrong-password": "Kata laluan salah. Sila cuba lagi.",
    "auth/too-many-requests": "Terlalu banyak cubaan. Sila tunggu sebentar.",
    "auth/popup-closed-by-user": "Tetingkap login ditutup.",
    "auth/network-request-failed": "Ralat rangkaian. Sila semak sambungan internet.",
    "auth/invalid-credential": "Emel atau kata laluan tidak betul."
  };
  return messages[code] || "Ralat berlaku. Sila cuba lagi.";
}

/**
 * Show toast notification
 */
function showToast(message, type = "info") {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;

  const colors = {
    success: "#00d67f",
    error: "#e63946",
    info: "#00c8ff",
    warning: "#f5a623"
  };

  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    background: ${colors[type] || colors.info};
    color: ${type === "success" ? "#000" : "#fff"};
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    font-size: 14px;
    z-index: 9999;
    letter-spacing: 0.5px;
    white-space: nowrap;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: fadeInUp 0.3s ease-out;
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
  } else {
    console.log("User logged out");
    localStorage.removeItem("redhat_user");
  }
});
