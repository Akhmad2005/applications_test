<script lang="ts">
import { mapActions } from "vuex";
import ru_RU from "ant-design-vue/es/locale/ru_RU";

export default {
  data() {
    return {
      ru_RU,
    };
  },
  methods: {
    ...mapActions("premises", ["fetchPremises"]),
    ...mapActions("apartments", ["fetchApartments"]),
  },
  mounted() {
    this.fetchPremises({ params: { page_size: 10000 } });
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
