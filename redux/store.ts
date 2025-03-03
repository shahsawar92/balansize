import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import articlesReducer from "./api/articles-api";
import authApi from "./api/auth-api";
import categoryReducer from "./api/categories-api";
import expertApiReducer from "./api/expert-api";
import questionReducer from "./api/questionnaire-api";
import courseApiReducer from "./api/courses-api";
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(questionReducer.middleware)
      .concat(categoryReducer.middleware)
      .concat(articlesReducer.middleware)
      .concat(expertApiReducer.middleware)
      .concat(courseApiReducer.middleware),
});

// Infer types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for using typed dispatch and selector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
