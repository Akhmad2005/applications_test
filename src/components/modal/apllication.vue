<script>
import { formatDate } from "@/utilities/functions";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import "moment/locale/ru";

moment.updateLocale("ru", {
  weekdaysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  monthsShort: [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ],
});

moment.locale("ru");

const baseForm = {
  premise_id: undefined,
  apartment_id: undefined,
  applicant: {
    last_name: "",
    first_name: "",
    patronymic_name: "",
    username: "",
  },
  description: "",
  due_date: "",
  status_id: 1,
};

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    appeal: {
      type: [Object, null],
      default: () => null,
    },
  },
  data() {
    return {
      formatDate,
      moment,
      form: { ...baseForm },
      rules: {
        premise_id: [
          {
            required: true,
            message: "Пожалуйста, выберите дом",
            trigger: "change",
          },
        ],
        apartment_id: [
          {
            required: true,
            message: "Пожалуйста, выберите квартиру",
            trigger: "change",
          },
        ],
        due_date: [
          {
            required: true,
            message: "Пожалуйста, выберите срок",
            trigger: "change",
          },
        ],
        "applicant.last_name": [
          {
            required: true,
            message: "Пожалуйста, введите фамилию",
            trigger: "change",
          },
        ],
        "applicant.first_name": [
          {
            required: true,
            message: "Пожалуйста, введите имя",
            trigger: "change",
          },
        ],
        "applicant.patronymic_name": [
          {
            required: true,
            message: "Пожалуйста, введите отчество",
            trigger: "change",
          },
        ],
        "applicant.username": [
          {
            required: true,
            message: "Пожалуйста, введите телефон",
            trigger: "change",
          },
        ],
        description: [
          {
            required: true,
            message: "Пожалуйста, введите описание заявки",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters("premises", ["premises"]),
    ...mapGetters("apartments", ["apartments"]),
  },
  watch: {
    appeal: {
      handler(appeal) {
        if (appeal?.id) {
          this.form.apartment_id =
            appeal?.apartment?.id || baseForm.apartment_id;
          this.form.premise_id = appeal?.premise?.id || baseForm.premise_id;
          this.form.due_date = appeal?.due_date || baseForm.due_date;
          this.form.description = appeal?.description || baseForm.description;
          this.form.applicant = appeal?.applicant || baseForm.applicant;
          this.form.status_id = appeal?.status.id || baseForm.status_id;
          this.form.id = appeal?.id || undefined;
        } else {
          this.form = { ...baseForm };
        }
      },
      immediate: true,
    },
    "form.premise_id": {
      handler(id) {
        this.fetchApartments({ params: { premise_id: id, pageSize: 10000 } });
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions("applications", ["createApplication", "updateApplication"]),
    ...mapActions("apartments", ["fetchApartments"]),
    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          try {
            if (this.appeal?.id) {
              let { status_id, ...form } = this.form;
              this.updateApplication({ id: this.appeal?.id, form });
            } else {
              this.createApplication({
                form: { ...this.form },
              });
            }
            this.$emit("success");
          } catch (error) {
            console.error("error submit", error);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDueDateChange(val) {
      this.form.due_date = val;
    },
  },
};
</script>

<template>
  <a-modal
    width="738px"
    centered
    :closable="false"
    @cancel="$emit('cancel')"
    :visible="visible"
    :cancelButtonProps="{
      style: { display: 'none' },
    }"
    dialogClass="modal_application"
    :footer="false"
  >
    <div class="content">
      <header class="content-header">
        <a-row :gutter="[20, 12]" type="flex">
          <a-col>
            <div class="content-header-title">
              <h3>
                {{
                  !appeal?.id
                    ? "Создание заявки"
                    : `Заявка № ${appeal.number} (от ${formatDate(
                        appeal.created_at,
                        false
                      )})`
                }}
              </h3>
            </div>
          </a-col>
          <a-col :flex="1"></a-col>
          <a-col>
            <div class="content-header-status">
              {{ !appeal?.id ? "Новая" : appeal.status.name }}
            </div>
          </a-col>
        </a-row>
      </header>
      <div class="content-form">
        <a-form-model
          :model="form"
          :rules="rules"
          ref="ruleForm"
          @submit="handleSubmit"
          @submit.native.prevent
        >
          <div class="content-inputs">
            <a-row
              :gutter="[
                { xs: 8, sm: 12, md: 14 },
                { xs: 8, sm: 16, md: 32 },
              ]"
              type="flex"
            >
              <a-col :xs="24" :sm="24" :md="12" :lg="8">
                <a-form-model-item
                  ref="premise_id"
                  :class="{ active: form.premise_id }"
                  prop="premise_id"
                >
                  <a-select
                    :options="
                      premises?.map((p) => ({
                        value: p.id,
                        label: p.full_address,
                        title: p.full_address,
                      }))
                    "
                    :optionFilterProp="'title'"
                    showSearch
                    allowClear
                    placeholder="Дом"
                    v-model="form.premise_id"
                  >
                    <g-icon name="down-triangle" slot="suffixIcon"></g-icon>
                  </a-select>
                  <span class="ant-my-placeholder"> Дом </span>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="8">
                <a-form-model-item
                  ref="apartment_id"
                  prop="apartment_id"
                  :class="{ active: form.apartment_id }"
                >
                  <a-select
                    :options="
                      apartments?.map((p) => ({
                        value: p.id,
                        label: p.label,
                        title: p.label,
                      }))
                    "
                    :optionFilterProp="'title'"
                    showSearch
                    :disabled="!form.premise_id"
                    allowClear
                    placeholder="Квартира"
                    v-model="form.apartment_id"
                  >
                    <g-icon name="down-triangle" slot="suffixIcon"></g-icon>
                  </a-select>
                  <span class="ant-my-placeholder"> Квартира </span>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="8">
                <a-form-model-item
                  ref="due_date"
                  prop="due_date"
                  :class="{ active: form.due_date }"
                >
                  <a-date-picker
                    @change="handleDueDateChange"
                    style="width: 100%"
                    showTime
                    format="DD.MM.YYYY HH:mm"
                  >
                    <a-input
                      placeholder="Срок"
                      :value="
                        form.due_date ? this.formatDate(form.due_date) : ''
                      "
                    >
                    </a-input>
                    <template #suffixIcon></template>
                  </a-date-picker>
                  <span class="ant-my-placeholder"> Срок </span>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="6">
                <a-form-model-item
                  ref="applicant.last_name"
                  prop="applicant.last_name"
                  :class="{ active: form.applicant.last_name }"
                >
                  <a-input
                    type="text"
                    v-model="form.applicant.last_name"
                    placeholder="Фамилия"
                  >
                  </a-input>
                  <span class="ant-my-placeholder"> Фамилия </span>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="6">
                <a-form-model-item
                  ref="applicant.first_name"
                  prop="applicant.first_name"
                  :class="{ active: form.applicant.first_name }"
                >
                  <a-input
                    type="text"
                    v-model="form.applicant.first_name"
                    placeholder="Имя"
                  >
                  </a-input>
                  <span class="ant-my-placeholder"> Имя </span>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="6">
                <a-form-model-item
                  :class="{ active: form.applicant.patronymic_name }"
                  ref="applicant.patronymic_name"
                  prop="applicant.patronymic_name"
                >
                  <a-input
                    type="text"
                    v-model="form.applicant.patronymic_name"
                    placeholder="Отчество"
                  >
                  </a-input>
                  <span class="ant-my-placeholder"> Отчество </span>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="6">
                <a-form-model-item
                  ref="applicant.username"
                  prop="applicant.username"
                  :class="{ active: form.applicant.username }"
                >
                  <a-input
                    type="text"
                    v-model="form.applicant.username"
                    placeholder="Телефон"
                  >
                  </a-input>
                  <span class="ant-my-placeholder"> Телефон </span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  ref="description"
                  prop="description"
                  :class="{ active: form.description }"
                >
                  <a-textarea
                    type="text"
                    v-model="form.description"
                    placeholder="Описание заявки"
                    :autoSize="{
                      minRows: 6,
                      maxRows: 6,
                    }"
                  >
                  </a-textarea>
                  <span class="ant-my-placeholder"> Описание заявки </span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <a-form-model-item html-type="submit">
            <a-row justify="end" type="flex">
              <a-button html-type="submit" type="primary"
                >{{ appeal?.id ? "Сохранить" : "Создать" }}
              </a-button>
            </a-row>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </a-modal>
</template>
