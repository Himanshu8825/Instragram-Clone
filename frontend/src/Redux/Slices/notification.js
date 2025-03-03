import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    likeNotification: [],
    viewedNotifications: [], // To track seen notifications
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === 'like') {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === 'dislike') {
        state.likeNotification = state.likeNotification.filter(
          (noti) =>
            !(
              noti.userId === action.payload.userId &&
              noti.postId === action.payload.postId
            )
        );
      }
    },
    clearNotificationBadge: (state) => {
      state.viewedNotifications = state.likeNotification.map((noti) => noti._id);
    },
  },
});

export const { setLikeNotification, clearNotificationBadge } = notificationSlice.actions;

export default notificationSlice.reducer;
