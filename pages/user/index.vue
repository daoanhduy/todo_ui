<template>
  <v-app style="padding: 15px; max-width: 100%">
    <div class="infoAndForm">
      <span
        >Hi!
        {{
          loggedInUser.firstName == null && loggedInUser.lastName == null
            ? loggedInUser.username
            : loggedInUser.firstName + " " + loggedInUser.lastName
        }}
        <a href="#" v-on:click="logout()">Click to logout!</a><br
      /></span>

      <br />
      <div class="formAddTodo">
        <v-text-field
          label="Title"
          :rules="rules"
          hide-details="auto"
          v-model="Todo.Title"
        ></v-text-field>
        <br />
        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          max-width="100%"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :value="moment(Todo.End_At).format('DD-MM-YYYY')"
              label="Time End"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="Todo.End_At"
            :min="minDate"
            @change="menu1 = false"
          ></v-date-picker>
        </v-menu>
        <v-btn
          width="100%"
          outlined
          color="success"
          :loading="loading"
          :disabled="loading"
          @click="addTodo()"
        >
          Add
        </v-btn>
      </div>
    </div>
    <br />
    <div class="todoList">
      <div class="filter">
        <span>Filter: </span>
        <input type="radio" name="filter" value="Done" @click="filter(1)" />
        Done
        <input
          type="radio"
          name="filter"
          value="NotYet"
          @click="filter(-1)"
          checked
        />
        Not Yet
        <input type="radio" name="filter" value="Clear" @click="filter(0)" />
        Clear
      </div>
      <div class="list-card">
        <TableTodo :item="item" :filterTodo="filterOpt" />
      </div>
    </div>
  </v-app>
</template>
<style>
.infoAndForm {
  width: 45%;
  margin-left: auto;
  margin-right: auto;
}
@media only screen and (max-width: 900px) {
  .infoAndForm {
    width: 80% !important;
  }
}
@media only screen and (max-width: 300px) {
  body {
    display: none;
  }
}
</style>
<script>
import UserAPI from "~/api/User/index.js";
import TodoAPI from "~/api/Todo/index.js";
import TableTodo from "~/components/TableTodo.vue";
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  head() {
    return {
      title: "User"
    };
  },
  layout: "default",
  components: { TableTodo },
  data() {
    return {
      item: null,
      rules: [
        value => value.length > 0 || "Required.",
        value => value.length < 50 || "Max length is 50 characters."
      ],
      ModelInput: {
        firstName: "",
        lastName: ""
      },
      Todo: {
        Title: "",
        End_At: moment().format("YYYY-MM-DD"),
        inDone: false,
        userId: 0
      },
      ArrayTodo: [],
      StoreData: [],
      minDate: moment().format("YYYY-MM-DD"),
      menu1: false,
      loading: false,
      filterOpt: -1
    };
  },
  async asyncData({ app, params, query }) {},
  mounted() {
    TodoAPI.GetAll(this.$axios, this.loggedInUser.id).then(rs => {
      this.ArrayTodo = rs.data.data;
      this.StoreData = rs.data.data;
      this.ArrayTodo.sort((a, b) => {
        return new Date(a.end_At) - new Date(b.end_At);
      });
    });
  },
  methods: {
    filter(value) {
      this.ArrayTodo = [];
      switch (value) {
        case 0:
          this.filterOpt = 0;
          this.ArrayTodo = this.StoreData;
          break;
        case 1:
          this.filterOpt = 1;
          this.StoreData.forEach(item => {
            if (item.isDone == true) {
              this.ArrayTodo.push(item);
            }
          });
          break;
        case -1:
          this.filterOpt = -1;
          this.StoreData.forEach(item => {
            if (item.isDone == false) {
              this.ArrayTodo.push(item);
            }
          });
          break;
      }
    },
    async logout() {
      await this.$auth.logout();
      return this.$router.push({ path: "/auth/login" });
    },
    addTodo() {
      this.Todo.userId = this.loggedInUser.id;
      this.loading = true;
      TodoAPI.AddTodo(this.$axios, this.Todo)
        .then(rs => {
          this.item = rs.data.data;
          setTimeout(() => {
            this.loading = false;
            this.Todo.Title = " ";
            this.Todo.End_At = this.minDate;
          }, 500);
        })
        .catch(er => {
          this.loading = false;
          $.alert({
            title: "Lỗi",
            content: "Tạo Task Không Thành Công",
            type: "red"
          });
        });
    },
    moment(date) {
      return moment(new Date(date));
    },
    updateInforUser() {
      UserAPI.UpdateUser(this.$axios, this.ModelInput)
        .then(resp => {
          $.confirm({
            title: "Xác Nhận",
            content: "Thành Công.",
            type: "green",
            autoClose: "cancelAction|3000",
            buttons: {
              cancelAction: { text: "Hủy", action: () => {} }
            }
          });
          this.ModelInput = "";
          window.location.reload();
        })
        .catch(er => {
          $.alert({
            title: "Lỗi",
            content: "Cập Nhật Thông Tin Không Thành Công",
            type: "red"
          });
        });
    }
  },
  computed: {
    ...mapGetters(["loggedInUser"])
  }
};
</script>