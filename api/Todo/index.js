export const TodoAPI = {
  GetAll(axios, userid) {
    return axios.get("/api/Task/GetAllTask?userId=" + userid).then(resp => {
      return resp;
    });
  },
  AddTodo(axios, model) {
    return axios.post("/api/Task/AddTask", model).then(resp => {
      return resp;
    });
  },
  DoneTodo(axios, taskId) {
    return axios.put("/api/Task/DoneTask?taskid=" + taskId).then(resp => {
      return resp;
    });
  },
  DeleteTodo(axios, taskId) {
    return axios.delete("/api/Task/DeleteTask?taskid=" + taskId).then(resp => {
      return resp;
    });
  }
};

export default TodoAPI;
