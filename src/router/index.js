import { createBrowserRouter } from "react-router-dom";
import RootRayout from "../layout/RootRayout";
import Home from "../Page/Home";
import CreateContent from "../Page/CreateContent";
import Chat from "../Page/Chat";
import StreamChat from "../Page/StreamChat";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootRayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/create-content",
        Component: CreateContent,
      },
      {
        path: "/chat",
        Component: Chat,
      },
      {
        path: "/stream-chat",
        Component: StreamChat,
      },
    ],
  },
]);

export default router;
