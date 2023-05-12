import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../firebase";


const initialState = {
    user: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(signInApi.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(signOutApi.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const signInApi = createAsyncThunk("user/signInApi", async () => {
    const response = await signInWithPopup(auth, provider);
    return response.user;
});

export const getUserAuth = () => {
    return (dispatch) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                dispatch(setUser(user));
            }
        });
    };
};

export const signOutApi = createAsyncThunk("user/signOutApi", async () => {
    await signOut(auth);
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
