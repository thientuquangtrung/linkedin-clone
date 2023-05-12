import { createSlice } from "@reduxjs/toolkit";
import db, { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
} from "firebase/firestore";

const initialState = {
    articles: [],
    loading: false,
};

const articleSlice = createSlice({
    name: "article",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        getArticles: (state, action) => {
            state.articles = action.payload;
        }
    },
});

export const postArticleApi = (payload) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        if (payload.image !== "") {
            const storageRef = ref(storage, `/files/${payload.image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, payload.image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    ); // update progress
                    if (snapshot.state === "RUNNING") {
                        console.log(`Progress: ${percent}`);
                    }
                },
                (err) => console.log(err),
                async () => {
                    // download url
                    const downloadURL = await getDownloadURL(
                        uploadTask.snapshot.ref
                    );

                    const dbRef = collection(db, "articles");
                    await addDoc(dbRef, {
                        actor: {
                            description: payload.user.email,
                            title: payload.user.displayName,
                            date: payload.timestamp,
                            image: payload.user.photoURL,
                        },
                        video: payload.video,
                        sharedImg: downloadURL,
                        comments: 0,
                        description: payload.description,
                    });
                    dispatch(setLoading(false));
                }
            );
        } 
        else if (payload.video) {
            const dbRef = collection(db, "articles");
            await addDoc(dbRef, {
                actor: {
                    description: payload.user.email,
                    title: payload.user.displayName,
                    date: payload.timestamp,
                    image: payload.user.photoURL,
                },
                video: payload.video,
                sharedImg: "",
                comments: 0,
                description: payload.description,
            });
            dispatch(setLoading(false));
        }
    };
};

export const getArticlesApi = () => {
    return async (dispatch) => {
        let payload = [];

        const q = query(
            collection(db, "articles"),
            orderBy("actor.date", "desc")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            payload.push(doc.data())
        });
        dispatch(getArticles(payload))
    };
};

export const { setLoading, getArticles } = articleSlice.actions;

export default articleSlice.reducer;
