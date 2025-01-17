import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null,
  },
  reducers: {
    SetChats: (state, action) => {
      state.chats = action.payload;
    },
    SetSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    SetOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { SetChats, SetSelectedChat, SetOnlineUsers } = chatSlice.actions;
export default chatSlice;
