export const UserAPI = {
  UpdateUser(axios, model) {
    return axios.post("/api/Users/UpdateUser", model).then(resp => {
      return resp;
    });
  }
};

export default UserAPI;
