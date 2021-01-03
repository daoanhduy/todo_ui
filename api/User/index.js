export const UserAPI = {
  UpdateUser(axios, model) {
    return axios.post("/api/Users/UpdateInfo", model).then(resp => {
      return resp;
    });
  }
};

export default UserAPI;
