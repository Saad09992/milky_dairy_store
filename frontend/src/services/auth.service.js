import api from "../api/baseUrl";

class AuthService {
  async login(email, password) {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });
    console.log(data);
    return data;
  }

  async googleLogin(code) {
    const { data } = await api.post("/auth/google", {
      code,
    });
    return data;
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
  }

  forgotPassword(email) {
    return api.post("/auth/forgot-password", {
      email,
    });
  }

  checkToken(token, email) {
    return api.post("auth/check-token", {
      token,
      email,
    });
  }

  resetPassword(token, email, password, password2) {
    return api.post("auth/reset-password", {
      token,
      email,
      password,
      password2,
    });
  }

  register(username, email, password, fullname) {
    return api.post("auth/signup", {
      username,
      email,
      password,
      fullname,
    });
  }

  getCurrentUser() {
    return api.get("/users/profile");
  }
}

export default new AuthService();
