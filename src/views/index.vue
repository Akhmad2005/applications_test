<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { formatDate } from "@/utilities/functions";
import { ref } from "vue";
import ApplicationModal from "@/components/modal/apllication.vue";

export default {
  components: { ApplicationModal },
  data() {
    return {
      timeoutId: null,
      columns: [
        {
          title: "№",
          dataIndex: "number",
          key: "number",
          scopedSlots: { customRender: "number" },
          className: "tag-column",
        },
        {
          title: "Создана",
          dataIndex: "created_at",
          key: "created_at",
          customRender(text) {
            return formatDate(text, false);
          },
        },
        {
          title: "Адрес",
          customRender(record, index) {
            return `${record?.premise?.address || ""} ${
              record?.apartment?.label || ""
            }`;
          },
          key: "address",
        },
        {
          title: "Заявитель",
          key: "applicant",
          dataIndex: "applicant",
          customRender(text) {
            return `${text?.last_name || ""}
            ${text?.first_name?.[0] ? text?.first_name?.[0] + "." : ""}
            ${
              text?.patronymic_name?.[0] ? text?.patronymic_name?.[0] + "." : ""
            }`;
          },
        },
        {
          title: "Описание",
          key: "description",
          dataIndex: "description",
        },
        {
          title: "Срок",
          key: "due_date",
          dataIndex: "due_date",
          customRender(text) {
            return formatDate(text);
          },
        },
        {
          title: "Статус",
          key: "status",
          dataIndex: "status.name",
        },
      ],
      applicatonModal: {
        visible: false,
        appeal: null,
      },
    };
  },
  computed: {
    ...mapGetters("applications", [
      "applications",
      "params",
      "total",
      "loading",
    ]),
    ...mapGetters("premises", ["premises"]),
  },
  methods: {
    ...mapActions("premises", ["fetchPremises"]),
    ...mapActions("applications", ["fetchApplications"]),
    handlePaginate(page, page_size) {
      let params = {
        page: page,
        page_size: page_size,
      };
      this.fetchApplications({ params });
    },
    handleSearchValueChange(event) {
      const input = event.target;
      const search = input.value;
      this.timeoutId && clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {
        this.fetchApplications({ params: { search } });
      }, 500);
    },
    handlePremiseSelect(value) {
      this.fetchApplications({ params: { premise_id: value } });
    },
    handleModalCancel() {
      this.applicatonModal.visible = false;
      this.applicatonModal.appeal = null;
    },
    handleModalSuccess() {
      this.applicatonModal.visible = false;
      this.applicatonModal.appeal = null;
      this.fetchApplications();
    },
    handleApplicationCreate() {
      this.applicatonModal.visible = true;
      this.applicatonModal.appeal = null;
    },
  },
  mounted() {
    this.fetchPremises({ params: { page_size: 10000 } });
    this.fetchApplications();
  },
};
</script>

<template>
  <div class="page_applications">
    <a-affix :offset-top="0">
      <header class="page_applications-header">
        <h2>Список заявок</h2>
      </header>
    </a-affix>
    <main class="page_applications-body">
      <div class="page_applications-table">
        <header class="page_applications-table-header">
          <a-row type="flex">
            <a-col :flex="1"></a-col>
            <a-col>
              <a-button
                class="page_applications-table-header-btn"
                type="primary"
                @click="handleApplicationCreate"
              >
                СОЗДАТЬ
              </a-button>
            </a-col>
          </a-row>
        </header>
        <div class="page_applications-table-filters">
          <a-form>
            <a-row type="flex" :gutter="[15, 8]">
              <a-col :xs="24" :sm="24" :md="12">
                <a-form-item :class="{ active: params.search }">
                  <a-input
                    :defaultValue="params.search"
                    @change="handleSearchValueChange"
                    placeholder="Поиск (№ заявки, название)"
                  >
                    <g-icon name="search" slot="suffix"></g-icon>
                  </a-input>
                  <span class="ant-my-placeholder">
                    Поиск (№ заявки, название)
                  </span>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12">
                <a-form-item :class="{ active: params.premise_id }">
                  <a-select
                    allowClear
                    :options="
                      premises.map((p) => ({
                        value: p.id,
                        label: p.full_address,
                        title: p.full_address,
                      }))
                    "
                    showSearch
                    optionFilterProp="title"
                    @change="handlePremiseSelect"
                    style="width: 100%"
                    placeholder="Дом"
                    :defaultValue="params.premise_id"
                  >
                    <g-icon name="down-triangle" slot="suffixIcon"></g-icon>
                  </a-select>
                  <span class="ant-my-placeholder"> Дом </span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="page_applications-table-list">
          <a-table
            :pagination="false"
            :columns="columns"
            :data-source="applications"
            rowKey="number"
            :loading="loading"
          >
            <template v-slot:number="number, record">
              <a-tag
                @click="
                  () => {
                    applicatonModal.visible = true;
                    applicatonModal.appeal = record;
                  }
                "
                class="link"
                color="var(--color-primary-light)"
              >
                {{ number }}
              </a-tag>
            </template>
          </a-table>
          <g-table-pagination
            :current="params.page"
            :pageSize="params.page_size"
            :total="total"
            @onPaginate="handlePaginate"
          ></g-table-pagination>
        </div>
      </div>
      <ApplicationModal
        :appeal="applicatonModal.appeal"
        v-if="applicatonModal.visible"
        :visible="applicatonModal.visible"
        @cancel="handleModalCancel"
        @success="handleModalSuccess"
      ></ApplicationModal>
    </main>
  </div>
</template>
