import { Models } from "appwrite";

export interface User extends Models.User<Models.Preferences> {
    // Add any custom extensions here if needed
}

export interface AuthState {
    user: User | null;
    session: Models.Session | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
