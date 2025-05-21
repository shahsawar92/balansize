import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import homeMessageApiReducer from "./api/app-message-api";
import articlesReducer from "./api/articles-api";
import authApi from "./api/auth-api";
import categoryReducer from "./api/categories-api";
import communityApiReducer from "./api/community-api";
import courseDetailsApiReducer from "./api/course-detail-api";
import courseApiReducer from "./api/courses-api";
import expertApiReducer from "./api/expert-api";
import homeApiReducer from "./api/home-api";
import notificationApiReducer from "./api/notifications-api";
import onboardingApiReducer from "./api/onboarding-api";
import partnerApiReducer from "./api/partners-api";
import planApiReducer from "./api/plan-api";
import questionReducer from "./api/questionnaire-api";
import quizQuestionApiReducer from "./api/quiz-questions";
import tagsApiReducer from "./api/tags-api";
import uploadApiReducer from "./api/uploads-api";
import userApiReducer from "./api/users-api";
import videosApiReducer from "./api/videos-api";
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
    [tagsApiReducer.reducerPath]: tagsApiReducer.reducer,
    [courseDetailsApiReducer.reducerPath]: courseDetailsApiReducer.reducer,
    [partnerApiReducer.reducerPath]: partnerApiReducer.reducer,
    [homeApiReducer.reducerPath]: homeApiReducer.reducer,
    [onboardingApiReducer.reducerPath]: onboardingApiReducer.reducer,
    [notificationApiReducer.reducerPath]: notificationApiReducer.reducer,
    [quizQuestionApiReducer.reducerPath]: quizQuestionApiReducer.reducer,
    [homeMessageApiReducer.reducerPath]: homeMessageApiReducer.reducer,
    [planApiReducer.reducerPath]: planApiReducer.reducer,
    [communityApiReducer.reducerPath]: communityApiReducer.reducer,
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
      .concat(uploadApiReducer.middleware)
      .concat(tagsApiReducer.middleware)
      .concat(courseDetailsApiReducer.middleware)
      .concat(partnerApiReducer.middleware)
      .concat(homeApiReducer.middleware)
      .concat(onboardingApiReducer.middleware)
      .concat(notificationApiReducer.middleware)
      .concat(quizQuestionApiReducer.middleware)
      .concat(homeMessageApiReducer.middleware)
      .concat(planApiReducer.middleware)
      .concat(communityApiReducer.middleware),
});

// Infer types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for using typed dispatch and selector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
