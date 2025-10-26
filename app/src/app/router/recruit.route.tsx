import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "./root-route";
import UploadPage from "@/modules/recruit/ui/pages/upload/UploadPage";
import ChatPage from "@/modules/recruit/ui/pages/chat/ChatPage";
import { RecruitLayout } from "@/modules/recruit/ui/layouts/RecruitLayout";

const RecruitRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/recruit",
  component: RecruitLayout,
});

export const UploadRoute = createRoute({
  getParentRoute: () => RecruitRoute,
  path: "/upload",
  component: UploadPage,
});

export const ChatRoute = createRoute({
  getParentRoute: () => RecruitRoute,
  path: "/chat",
  component: ChatPage,
});

export const recruitRoutes = [RecruitRoute, UploadRoute, ChatRoute];
