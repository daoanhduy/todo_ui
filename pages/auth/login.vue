<template>
  <div id="page">
    <div id="login-area">
      <div class="background" />
      <div class="info">
        <div class="title">
          <h3>Đăng Nhập</h3>
        </div>
        <div class="username">
          <span><i class="fa fa-user-o" aria-hidden="true" /></span>
          <input
            v-model="ModelLogin.Username"
            type="text"
            maxlength="65"
            autocomplete="false"
            autofocus="true"
          />
        </div>
        <div class="password">
          <span><i class="fa fa-key" aria-hidden="true" /> </span>
          <input
            v-model="ModelLogin.Password"
            type="password"
            maxlength="100"
            minlength="8"
            autocomplete="false"
          />
        </div>
        <div class="btnSubmit d-flex justify-content-between">
          <span style="margin: 0; padding-left: 20px"
            ><input type="checkbox" /> Nhớ mật khẩu</span
          >
          <button
            type="button"
            class="btn btn-primary"
            id="btnLogin"
            @click="Login()"
          >
            Login
          </button>
        </div>
      </div>
      <div id="register-area">
        <a href="#" @click="showModal = true">Đăng kí tài khoản</a>
        <Modal v-model="showModal" title="Đăng kí tài khoản">
          <div class="form-group" style="margin-bottom: 0">
            <div class="form-group-control">
              <label for="username" style="font-weight: bold"
                >Tên đăng nhập:</label
              >
              <input
                type="text"
                maxlength="65"
                name="username"
                class="form-control"
                v-model="ModelRegister.Username"
                autocomplete="false"
              />
            </div>
            <div class="form-group-control mt-2">
              <label for="password" style="font-weight: bold">Mật khẩu:</label>
              <input
                type="password"
                name="password"
                maxlength="50"
                class="form-control"
                v-model="ModelRegister.Password"
                autocomplete="false"
              />
            </div>
            <div class="form-group-control mt-2">
              <label for="confirm_password" style="font-weight: bold"
                >Xác Nhận Mật khẩu:</label
              >
              <input
                type="password"
                maxlength="50"
                name="confirm_password"
                class="form-control"
                v-model="ModelRegister.Confirmation_password"
                autocomplete="false"
              />
            </div>
            <p
              style="color: red; font-size: 14px"
              v-for="(item, index) in error"
              :key="index"
            >
              {{ item }}
            </p>
          </div>
          <div class="modal-footer" style="padding: 10px 0 0 0">
            <button
              id="btnDKTK"
              class="btn btn-success"
              style="width: 100%"
              @click="register()"
            >
              Đăng kí
            </button>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>
<script>
import AuthAPI from "~/api/Auth/index.js";
export default {
  layout: "layout_login",
  data() {
    return {
      error: [],
      showModal: false,
      ModelLogin: {
        Username: "",
        Password: "",
        isRemember: false
      },
      ModelRegister: {
        Username: "",
        Password: "",
        Confirmation_password: ""
      }
    };
  },
  methods: {
    async Login() {
      try {
        document.getElementById("btnLogin").disabled = true;
        var result = await this.$auth.loginWith("local", {
          data: {
            username: this.ModelLogin.Username,
            password: this.ModelLogin.Password
          }
        });
        window.location.href = "/user";
        //return this.$router.push({ path: "/user" });
      } catch {
        document.getElementById("btnLogin").disabled = false;
        $.alert({
          title: "Lỗi",
          content: "Đăng Nhập Không Thành Công",
          type: "red"
        });
      }
    },
    register() {
      this.error = [];
      if (this.ModelRegister.Username.length < 0) {
        this.error.push("Chưa nhập tên đăng nhập.");
      }

      if (
        this.ModelRegister.Username.length > 0 &&
        this.ModelRegister.Username.length < 6
      ) {
        this.error.push("Tên đăng nhập phải ít nhất 6 ký tự.");
      }

      if (this.ModelRegister.Password.length <= 0) {
        this.error.push("Chưa nhập mật khẩu.");
      }

      if (
        this.ModelRegister.Password.length > 0 &&
        this.ModelRegister.Password.length < 8
      ) {
        this.error.push("Mật khẩu phải ít nhất 8 kí tự.");
      }

      if (this.ModelRegister.Confirmation_password.length <= 0) {
        this.error.push("Chưa nhập xác nhận mật khẩu.");
      }

      if (
        this.ModelRegister.Password.length > 0 &&
        this.ModelRegister.Confirmation_password.length > 0 &&
        this.ModelRegister.Password != this.ModelRegister.Confirmation_password
      ) {
        this.error.push("Xác nhận mật khẩu không khớp.");
      }
      if (this.error.length > 0) {
        return;
      }
      document.getElementById("btnDKTK").disabled = true;
      AuthAPI.Register(this.$axios, this.ModelRegister)
        .then(resp => {
          this.showModal = false;
          $.confirm({
            title: "Xác Nhận",
            content: "Thành Công.",
            type: "green",
            autoClose: "cancelAction|3000",
            buttons: {
              cancelAction: { text: "Hủy", action: () => {} }
            }
          });
          this.ModelRegister = "";
          document.getElementById("btnDKTK").disabled = false;
        })
        .catch(er => {
          this.error.push("Đăng kí không thành công.");
          this.error.push("Kiểm tra lại thông tin.");
          document.getElementById("btnDKTK").disabled = false;
        });
    }
  },

  head() {
    return {
      title: "Login"
    };
  }
};
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}
.vm-title {
  font-weight: bold;
}
@media screen and (max-width: 1000px) {
  .background {
    display: none;
  }
  .info {
    width: 100% !important;
    height: 80%;
  }
  .title {
    width: 100% !important;
    height: 25% !important;
  }
  .btnSubmit span {
    padding-left: 0 !important;
  }
  #register-area {
    height: 20% !important;
    width: 100% !important;
    position: absolute !important;
    bottom: 0;
    a {
      position: fixed !important;
      bottom: 0 !important;
      left: 19% !important;
    }
  }
}
#page {
  background-color: #f7f5f588;
}
#login-area {
  width: 60%;
  height: 75%;
  background-color: #ffffffee;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1.5%;
}
.background {
  float: left;
  height: 100%;
  width: 55%;
  background-image: url("./../../assets/Images/bg-login.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 1.5% 0 0 1.5%;
}
.info {
  float: right;

  height: 80%;
  width: 45%;
  text-align: center;
  position: absolute;
  bottom: 0;
  right: 0;
}
#register-area {
  height: 20%;
  width: 45%;
  text-align: center;

  position: absolute;
  bottom: 0;
  a {
    position: fixed;
    bottom: 0;
    left: 73%;
  }
}

.title {
  width: 100%;
  height: 15%;
}
.title h3 {
  font-weight: bold;
}
.btnSubmit {
  width: 90%;
}
.password,
.btnSubmit {
  margin-top: 35px;
}
.username,
.password {
  width: 100%;
  height: 29px;
  text-align: left;
  padding: 0 5% 0 5%;
  display: flex;
  span {
    width: 15%;
    font-size: 1.6rem;
    line-height: 15px;
    color: black;
    text-align: center;
  }
  input {
    width: 85%;
    font-size: 18px;
    border: none;
    border-bottom: 1px solid #dedede;
    &:focus {
      outline: none;
    }
  }
}
</style>
