import { makeAutoObservable } from "mobx";

export interface storeInterface {
  isLoading: boolean;
  isLoggedIn: boolean;
}
export default class Store {
  state: storeInterface;
  constructor() {
    this.state = {
      isLoading: false,
      isLoggedIn: false,
    };
    makeAutoObservable(this);
    this.checkAuth();
  }

  set isLoading(value: boolean) {
    this.state.isLoading = value;
  }

  set isLoggedIn(value: boolean) {
    this.state.isLoggedIn = value;
  }

  async checkAuth() {
    await this.refreshToken();
  }

  async login(username: string, password: string) {
    try {
      this.isLoading = true;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        console.log(data.refreshToken, "refreshToken");
        this.isLoggedIn = true;
        return {
          success: true,
          message: "Login successful",
        };
      }
      return {
        success: false,
        message: data.Message,
      };
    } catch (error: any) {
      console.log(error, "error");
      return {
        success: false,
        message: error.message,
      };
    } finally {
      this.isLoading = false;
    }
  }

  async logout() {
    try {
      this.isLoading = true;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        localStorage.removeItem("authToken");
        this.state.isLoggedIn = false;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
          credentials: "include",

        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        this.isLoggedIn = true;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

