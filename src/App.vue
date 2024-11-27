<script>
import ru_RU from "ant-design-vue/es/locale/ru_RU";

export default {
  data() {
    return {
      ru_RU,
    };
  },
};
</script>

<template>
  <div id="app">
    <a-config-provider :locale="ru_RU">
      <router-view />
    </a-config-provider>
  </div>
</template>
