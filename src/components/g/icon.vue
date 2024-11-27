<script>
const svgIcons = import.meta.glob("@/assets/svg/*.svg", { as: "raw" });

export default {
  props: {
    name: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      svgContent: "",
    };
  },
  watch: {
    name: {
      immediate: true,
      handler(newName) {
        if (newName && svgIcons[`/src/assets/svg/${newName}.svg`]) {
          svgIcons[`/src/assets/svg/${newName}.svg`]().then((content) => {
            this.svgContent = content;
          });
        } else {
          console.error(`SVG not found: ${newName}`);
          this.svgContent = "";
        }
      },
    },
  },
};
</script>

<template>
  <div
    v-if="svgContent"
    class="svg"
    @click="$emit('click')"
    v-html="svgContent"
  ></div>
</template>

<style lang="scss">
.svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
