import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import articlesReducer from "./api/articles-api";
import authApi from "./api/auth-api";
import categoryReducer from "./api/categories-api";
import courseApiReducer from "./api/courses-api";
import expertApiReducer from "./api/expert-api";
import questionReducer from "./api/questionnaire-api";
import userApiReducer from "./api/users-api";
import videosApiReducer from "./api/videos-api";
import uploadApiReducer from "./api/uploads-api";
// Import your reducers here
// import counterReducer from "./slices/counterSlice";
import authReducer from "./features/auth-slice";

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [questionReducer.reducerPath]: questionReducer.reducer,
    [categoryReducer.reducerPath]: categoryReducer.reducer,
    [articlesReducer.reducerPath]: articlesReducer.reducer,
    [expertApiReducer.reducerPath]: expertApiReducer.reducer,
    [courseApiReducer.reducerPath]: courseApiReducer.reducer,
    [videosApiReducer.reducerPath]: videosApiReducer.reducer,
    [userApiReducer.reducerPath]: userApiReducer.reducer,
    [uploadApiReducer.reducerPath]: uploadApiReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(questionReducer.middleware)
      .concat(categoryReducer.middleware)
      .concat(articlesReducer.middleware)
      .concat(expertApiReducer.middleware)
      .concat(courseApiReducer.middleware)
      .concat(videosApiReducer.middleware)
      .concat(userApiReducer.middleware)
      .concat(uploadApiReducer.middleware),
});

// Infer types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for using typed dispatch and selector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
