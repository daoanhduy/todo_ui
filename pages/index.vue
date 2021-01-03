<template>
  <div class="container text-center">
    <h1>Hi, {{ loggedInUser.username }}</h1>
    <h1>Welcome to Todo page</h1>
    <a href="/user">Detail</a><br />
    <a href="#" v-on:click="logout()">Click to logout!</a>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  head() {
    return {
      title: "Index"
    };
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      return this.$router.push({ path: "/auth/login" });
    }
  },
  layout: "default",
  computed: {
    ...mapGetters(["loggedInUser"])
  }
};
</script>
