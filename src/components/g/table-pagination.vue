<script>
export default {
  data() {
    return {};
  },
  props: {
    current: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    pageSizeOptions: {
      type: Array,
      default: () => [10, 20, 50, 100],
      required: false,
    },
  },
  emits: ["onPaginate"],
  methods: {
    handleChangePageSize(value) {
      this.$emit("onPaginate", 1, value);
    },
    handlePaginate(page, pageSize) {
      this.$emit("onPaginate", page, pageSize);
    },
  },
};
</script>

<template>
  <div class="g-table-pagination">
    <a-row :align="'middle'" type="flex">
      <a-col :flex="1">
        <a-space :size="16">
          <div class="g-table-pagination-total">
            <p>
              <strong>{{ (current - 1) * pageSize + 1 }}</strong>
              -
              <strong>
                {{
                  current == Math.ceil(total / pageSize)
                    ? total
                    : current * pageSize
                }}
              </strong>
              из
              <strong>{{ total }}</strong>
              записей
            </p>
          </div>
          <div class="g-table-pagination-change_size">
            <a-select
              :options="
                pageSizeOptions.map((o) => ({
                  value: o,
                  label: o,
                }))
              "
              style="width: 100%"
              placeholder="Дом"
              :defaultValue="pageSize"
              @change="handleChangePageSize"
            >
              <g-icon name="down-triangle" slot="suffixIcon"></g-icon>
            </a-select>
          </div>
        </a-space>
      </a-col>
      <a-col>
        <a-space>
          <a-icon
            class="double-icon"
            :class="{ disabled: current == 1 }"
            type="double-left"
            @click="
              () => {
                if (current !== 1) {
                  handlePaginate(1, pageSize);
                }
              }
            "
          />
          <a-pagination
            @change="handlePaginate"
            :current="current"
            :pageSize="pageSize"
            :total="total"
          >
          </a-pagination>
          <a-icon
            :class="{ disabled: current == Math.ceil(total / pageSize) }"
            class="double-icon"
            type="double-right"
            @click="
              () => {
                if (current !== Math.ceil(total / pageSize)) {
                  handlePaginate(Math.ceil(total / pageSize), pageSize);
                }
              }
            "
          />
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>
