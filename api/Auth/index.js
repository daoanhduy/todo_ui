export const AuthAPI = {
  Register(axios, model) {
    return axios.post("/api/Users/Register", model).then(resp => {
      return resp;
    });
  }
};

export default AuthAPI;
