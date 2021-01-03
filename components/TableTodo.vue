<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="ArrayData"
      :items-per-page="5"
      sort-by="TimeEnd"
      class="elevation-1"
    >
      <template v-slot:item.end_At="{ item }">
        {{ moment(item.end_At).format("DD-MM-YYYY") }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" v-if="item.isDone" @click="DoneTask(item)"
          >mdi-reload</v-icon
        >
        <v-icon
          small
          class="mr-2"
          @click="DoneTask(item)"
          color="success"
          v-else
          >mdi-check</v-icon
        >
        <v-icon small class="mr-2" color="red" @click="DeleteTodo(item.id)"
          >mdi-trash-can-outline</v-icon
        >
      </template>
    </v-data-table>
  </v-app>
</template>
<style>
@media only screen and (max-width: 900px) {
  .subTodo {
    width: 90% !important;
  }
}
.subTodo {
  max-width: 100%;
  width: 30%;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
}
.titleTableTodo {
  font-size: 1rem !important;
  font-weight: bold;
}
.displaynone {
  display: none !important;
}
.text-center {
  width: 150px !important;
}
.hidden {
  display: none !important;
}
</style>
<script>
import moment from "moment";
import TodoAPI from "~/api/Todo/index.js";
import { mapGetters } from "vuex";
export default {
  props: {
    item: Object,
    filterTodo: Number
  },
  data() {
    return {
      expanded: [],
      ArrayData: [],
      ArrayDataSub: [],
      Source: [],
      headers: [
        {
          text: "Title",
          align: "center",
          value: "title",
          sortable: false,
          class: "titleTableTodo"
        },
        {
          text: "Time End",
          align: "center",
          value: "end_At",
          class: "titleTableTodo"
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "titleTableTodo",
          align: "center"
        }
      ],
      today: moment().format("YYYY-MM-DD"),
      menu: false
    };
  },
  async mounted() {
    try {
      let rs = await TodoAPI.GetAll(this.$axios, this.loggedInUser.id);
      if (rs.data.data.length > 0) {
        this.Source = rs.data.data;
        this.ArrayData = rs.data.data
          .filter(x => !x.isDone)
          .sort((a, b) => {
            return new Date(a.end_At) - new Date(b.end_At);
          });
      }
    } catch {}
  },
  methods: {
    moment(date) {
      return moment(new Date(date));
    },
    DoneTask(item) {
      TodoAPI.DoneTodo(this.$axios, item.id)
        .then(rs => {
          item.isDone = !item.isDone;
          return;
        })
        .catch(er => {
          $.alert({
            title: "Lỗi",
            content: "Cập Nhật Không Thành Công",
            type: "red"
          });
        });
    },
    async FilterArray(opt) {
      if (this.filterTodo == opt) {
        this.ArrayData = await this.Source.filter(x => x.isDone).sort(
          (a, b) => {
            return new Date(a.end_At) - new Date(b.end_At);
          }
        );
      } else if (this.filterTodo == opt) {
        this.ArrayData = await this.Source.filter(x => !x.isDone).sort(
          (a, b) => {
            return new Date(a.end_At) - new Date(b.end_At);
          }
        );
      } else {
        this.ArrayData = await this.Source;
      }
    },
    async DeleteTodo(id) {
      TodoAPI.DeleteTodo(this.$axios, id)
        .then(() => {
          $.alert({
            title: "Thành Công",
            content: "Đã xóa",
            type: "green"
          });
          this.Source.forEach((item, index) => {
            if (item.id === id) {
              this.Source.splice(index, 1);
            }
          });
          if (this.filterTodo == 1) {
            this.ArrayData = this.Source.filter(x => x.isDone).sort((a, b) => {
              return new Date(a.end_At) - new Date(b.end_At);
            });
          } else if (this.filterTodo == -1) {
            this.ArrayData = this.Source.filter(x => !x.isDone).sort((a, b) => {
              return new Date(a.end_At) - new Date(b.end_At);
            });
          } else {
            this.ArrayData = this.Source;
          }
        })
        .catch(() => {
          $.alert({
            title: "Lỗi",
            content: "Cập Nhật Không Thành Công",
            type: "red"
          });
        });
    }
  },
  watch: {
    item(data) {
      if (data != null) {
        this.Source.push(data);
        if (this.filterTodo == 1) {
          this.ArrayData = this.Source.filter(x => x.isDone).sort((a, b) => {
            return new Date(a.end_At) - new Date(b.end_At);
          });
        } else if (this.filterTodo == -1) {
          this.ArrayData = this.Source.filter(x => !x.isDone).sort((a, b) => {
            return new Date(a.end_At) - new Date(b.end_At);
          });
        } else {
          this.ArrayData = this.Source.sort((a, b) => {
            return new Date(a.end_At) - new Date(b.end_At);
          });
        }
      }
    },
    filterTodo(opt) {
      if (opt == 1) {
        this.ArrayData = this.Source.filter(x => x.isDone).sort((a, b) => {
          return new Date(a.end_At) - new Date(b.end_At);
        });
      } else if (opt == -1) {
        this.ArrayData = this.Source.filter(x => !x.isDone).sort((a, b) => {
          return new Date(a.end_At) - new Date(b.end_At);
        });
      } else {
        this.ArrayData = this.Source.sort((a, b) => {
          return new Date(a.end_At) - new Date(b.end_At);
        });
      }
    }
  },
  computed: {
    ...mapGetters(["loggedInUser"])
  }
};
</script>