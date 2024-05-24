import {
  LoginPage,
  MainPage,
  RegisterPage,
  ProfilePage,
  ChangePasswordPage,
  TicketPage,
} from "../pages";

export const availableRoutes = [
  {
    path: "/",
    component: MainPage,
    requiresAuth: true,
  },
  {
    path: "/login",
    component: LoginPage,
    requiresAuth: false,
  },
  {
    path: "/register",
    component: RegisterPage,
    requiresAuth: false,
  },
  {
    path: "/profile",
    component: ProfilePage,
    requiresAuth: true,
  },
  {
    path: "/change-password",
    component: ChangePasswordPage,
    requiresAuth: true,
  },
    {
        path: "/ticket/:id",
        component: TicketPage,
        requiresAuth: true,
    },
];
