<template>
  <div class="row timline-component"
    id="timline-of-student-component">
    <div class="col-12">
      <div class="card">
        <header class="card-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            role="img"
            class="c-icon"
          >
            <path
              fill="var(--ci-primary-color, currentColor)"
              d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
              class="ci-primary"
            ></path>
          </svg>
          Time line
        </header>
        <div class="card-body">
          <div class="wrapper">
            <div class="steps" id="steps">
              <div
                class="step"
                v-for="(timeLine, index) in timeLines"
                :key="index + 'time-line'"
                :class="{
                  'step-unactive': !checkTimeLineExpired(timeLine.endDay),
                }"
              >
                <div
                  class="number completed"
                  v-if="checkTimeLineExpired(timeLine.endDay)"
                >
                  <svg viewBox="0 0 512 512" width="100" title="check">
                    <path
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                    />
                  </svg>
                </div>
                <div class="number" v-else>{{ index + 1 }}</div>
                <div class="info">
                  <p class="title">{{ timeLine.timeLineName }}</p>
                  <div
                    class="info-timeline cursor-default"
                  >
                    <span>
                      {{ convertTime(timeLine.startDay, "DD/MM/YYYY") }} -
                      {{ convertTime(timeLine.endDay, "DD/MM/YYYY") }}
                    </span>
                  </div>
                  <p class="text">
                    {{ timeLine.description }}
                  </p>
                </div>
              </div>
              <div v-if="timeLines.length == 0" class="font-weight-bolder">
                Không có dữ liệu được tìm thấy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import TimlineService from "../../../services/timeline/timelineServices";
import AppConfig from "../../../../src/app.config.json";
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "TimeLineComponent",
  extends: ComponentBase,
  mixins: [CrudMixin],
  props: {
    userInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      timeLines: [],
      editTimeLine: {},
      confirmTimeline: null,
      filterTimeLine: {
        planId: "",
      },
      userInfoProp: {},
    };
  },

  methods: {
    checkTimeLineExpired(time) {
      return new Date(time) > new Date();
    },

    async getTimeLinesByInternshipCourseIdAsync() {
      let filterTimeLine = {
        timeLineName: "",
        internshipCourseId: this.userInfoProp.internshipCourseId,
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new TimlineService();

      const response = await api.getTimeLinesByInternshipCourseIdAsync(filterTimeLine);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.timeLines = response.data;
    },

    async changePage(currentPage) {
      await this.getTimeLinesAsync(currentPage);
    },
  },

  watch: {
    async userInfo() {
      this.userInfoProp = this.userInfo;
      await this.getTimeLinesByInternshipCourseIdAsync();
    },
  },
};
</script>

<style lang="scss">
@import "../../PlanComponent/TimeLineComponent/TimeLineComponent.scss";
#timline-of-student-component {
  .cursor-default {
    cursor: default;
  }
}
</style>