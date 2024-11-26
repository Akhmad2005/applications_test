<script lang="ts">
import axios from "@/plugins/axios";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";

interface ComponentData {
  form: {
    username: string;
    password: string;
  };
  passwordInputType: "password" | "text";
  loading: boolean;
}

export default {
  data(): ComponentData {
    return {
      form: {
        username: "",
        password: "",
      },
      passwordInputType: "password",
      loading: false,
    };
  },
  computed: {
    tokenFromStorage() {
      return !!localStorage.getItem("authToken");
    },
  },
  methods: {
    async loginToAccount() {
      this.loading = true;
      try {
        const response = await axios.post("/api/auth/login/", {
          username: this.form.username,
          password: this.form.password,
        });
        this.finishSuccessfulLogin(response);
      } catch (error) {
        console.error("LoginError", error);
        if (error instanceof AxiosError) {
          this.catchAxiosError(error);
        }
      }
      this.loading = false;
    },
    catchAxiosError(error: AxiosError) {
      this.$message.error(
        (error?.response?.data as any)?.data?.non_field_errors?.[0] ||
          "Увы, произошла ошибка"
      );
    },
    finishSuccessfulLogin(response: AxiosResponse) {
      if (response?.data?.key) {
        localStorage.setItem("authToken", response.data.key);
        this.form.password = "";
        this.form.username = "";
        this.$router.push("/");
        this.$message.success("Вы успешно авторизовались");
      }
    },
    onLogin() {
      if (this.form.username || this.form.password) {
        this.loginToAccount();
      }
    },
  },
};
</script>

<template>
  <div class="page_login">
    <div class="">
      <div class="page_login-wrapper">
        <div class="page_login-card">
          <header class="header">
            <h2>Авторизация</h2>
          </header>
          <div class="form" v-if="!tokenFromStorage">
            <a-form>
              <div class="inputs">
                <a-space style="width: 100%" :size="12" direction="vertical">
                  <a-form-item :class="{ active: form.username }">
                    <a-input
                      v-decorator="[
                        'userName',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your username!',
                            },
                          ],
                        },
                      ]"
                      type="text"
                      v-model="form.username"
                      placeholder="Логин или Телефон"
                    >
                      <g-icon slot="prefix" name="phone" />
                    </a-input>
                    <span class="ant-my-placeholder with_prefix">
                      Логин или Телефон
                    </span>
                  </a-form-item>
                  <a-form-item :class="{ active: form.password }">
                    <a-input
                      :type="passwordInputType"
                      v-decorator="[
                        'password',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your password!',
                            },
                          ],
                        },
                      ]"
                      v-model="form.password"
                      placeholder="Пароль"
                    >
                      <g-icon slot="prefix" name="lock" />
                      <g-icon
                        class="link"
                        v-if="passwordInputType == 'text'"
                        slot="suffix"
                        name="hidden"
                        @click="passwordInputType = 'password'"
                      />
                      <g-icon
                        v-else
                        class="link"
                        slot="suffix"
                        name="eye"
                        @click="passwordInputType = 'text'"
                      />
                    </a-input>
                    <span class="ant-my-placeholder with_prefix"> Пароль </span>
                  </a-form-item>
                </a-space>
              </div>
              <a-form-item html-type="submit">
                <a-row justify="center" type="flex">
                  <a-button :loading="loading" @click="onLogin" type="primary">
                    Войти
                  </a-button>
                </a-row>
              </a-form-item>
            </a-form>
          </div>
          <div style="text-align: center" v-else>
            <h3>Вы уже авторизованы.</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
