<template>
  <div>
    <div class="col-12">
      <div class="card">
        <header class="card-header">
          <h5 class="float-left"
            v-if="notify.notification">
            Tiêu đề thông báo: {{notify.notification.title}}
          </h5>
          <div class="float-right">
            <button
              @click="$router.go(-1)"
              id="cancel"
              class="btn btn-dark mr-2"
            >
              Trở về
            </button>
          </div>          
        </header>
        <div class="card-body">
          <div class="row mb-2"
            v-if="notify.notification">
            <div class="col-12">
              <div>
                <span class="font-weight-bold">
                  Đợt thực tập:
                </span>
                {{notify.notification.internshipCourse.internshipCourseName}}
              </div>
              <div>
                <span class="font-weight-bold">
                  Người gửi:
                </span>
                  {{notify.userCreate}}
              </div>
              <div>
                <span class="font-weight-bold">
                  Ngày gửi:
                </span>
                {{convertTime(notify.notification.creationTime, 'HH:mm DD/MM/YYYY')}}
              </div>
            </div>
          </div>
          <div class="row mb-2" v-if="Object.keys(notifyReport).length !== 0">
            <div class="col-12">
              <div>
                Số người chưa xem là:
                <span class="font-weight-bold">{{
                  notifyReport.numberPeopleOfSend
                }}</span> người
              </div>
              <div>
                Số người đã xem là:
                <span class="font-weight-bold">{{
                  notifyReport.numberPeopleWatched
                }}</span> người
              </div>
            </div>
          </div>
          <div class="row" v-if="Object.keys(notifyReport).length !== 0">
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div class="table-responsive">
                <figure class="mb-0">
                  <figcaption class="caption-table mb-2">
                    <h5>Danh sách mail chưa xem thông báo</h5>
                  </figcaption>
                  <table class="table">
                    <thead class="">
                      <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Email</th>
                        <th scope="col">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(emailsPeopleSend, index) in pageOfItemsSendMail"
                        :key="index + 'emailsPeopleSend'"
                      >
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ emailsPeopleSend }}</td>
                        <td>
                          <button class="btn btn-success"
                            :disabled="currentSendMail[index]"
                            :class="{'cursor-default':currentSendMail[index]}"
                            @click="showSendAnEmailUrgingYouToSeeTheAnnouncement(emailsPeopleSend)">Gửi lại mail
                          </button>
                        </td>
                      </tr>
                      <tr
                        v-show="
                          notifyReport.emailsPeopleSend == null ||
                          notifyReport.emailsPeopleSend.length === 0
                        "
                      >
                        <th colspan="5" class="text-left">
                          Không có dữ liệu nào được tìm thấy.
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </figure>
                <ConfirmDialog :data="sendAnEmailUrgingYouToSeeTheAnnouncementModel"
                  @agree="sendAnEmailUrgingYouToSeeTheAnnouncementConfirm"
                  :message="'Bạn có muốn gửi mail hối thúc cho mail '+ sendAnEmailUrgingYouToSeeTheAnnouncementModel.email">
                </ConfirmDialog>
                <div class="card-footer d-flex justify-content-center text--blue"
                  v-show="pageOfItemsSendMail.length !== 0">
                  <JwPagination
                    :items="notifyReport.emailsPeopleSend"
                    @changePage="onChangePageSendMail"
                    :labels="customLabels"
                    :pageSize="10">
                  </JwPagination>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div class="table-responsive">
                <figure class="mb-0">
                  <figcaption class="caption-table mb-2 font-weight-bold">
                    <h5>Danh sách mail đã xem</h5>
                  </figcaption>
                  <table class="table">
                    <thead class="">
                      <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(
                          emailPeopleWatched, index
                        ) in pageOfItemsSeenMail"
                        :key="index + 'emailPeopleWatched'"
                      >
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ emailPeopleWatched }}</td>
                      </tr>
                      <tr
                        v-show="
                          notifyReport.emailPeopleWatched == null ||
                          notifyReport.emailPeopleWatched.length === 0
                        "
                      >
                        <th colspan="5" class="text-left">
                          Không có dữ liệu nào được tìm thấy.
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </figure>
                <div class="card-footer d-flex justify-content-center text--blue"
                  v-show="pageOfItemsSeenMail.length !== 0">
                  <JwPagination
                    :items="notifyReport.emailPeopleWatched"
                    @changePage="onChangePageSeenMail"
                    :labels="customLabels"
                    :pageSize="10">
                  </JwPagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NotificationService from "../../../services/notification/notificationServices";
import AppConfig from "../../../../src/app.config.json";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog" ;
import JwPagination from 'jw-vue-pagination';
import crudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "ReportNotificationComponent",
  extends: ComponentBase,
  components: {
    ConfirmDialog,
    JwPagination,
  },
  mixins:[crudMixin],
  props: {
    guid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      notifyReport: {},
      notify: {},
      sendAnEmailUrgingYouToSeeTheAnnouncementModel: {
        email: "",
        notifycationId: "",
        linkNotity: "",
      },
      pageOfItemsSendMail: [],
      pageOfItemsSeenMail: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      currentSendMail: {},
    }
  },

  async mounted() {
    await this.setNotifyAsync();
    await this.setNotifyReportAsync();
    this.sendAnEmailUrgingYouToSeeTheAnnouncementModel.notifycationId = this.guid;
    this.sendAnEmailUrgingYouToSeeTheAnnouncementModel.linkNotity = location.host +
      `/#/notify-of-user/${this.guid}`;
  },
  
  methods: {
    onChangePageSendMail(pageOfItemsSendMail) {
      // update page of items
      this.pageOfItemsSendMail = pageOfItemsSendMail;
    },

    onChangePageSeenMail(pageOfItemsSeenMail) {
      // update page of items
      this.pageOfItemsSeenMail = pageOfItemsSeenMail;
    },

    showSendAnEmailUrgingYouToSeeTheAnnouncement(email) {
      this.sendAnEmailUrgingYouToSeeTheAnnouncementModel = {};
      this.sendAnEmailUrgingYouToSeeTheAnnouncementModel.notifycationId = this.guid;
      this.sendAnEmailUrgingYouToSeeTheAnnouncementModel.linkNotity = location.host +
      `/#/notify-of-user/${this.guid}`;
      this.sendAnEmailUrgingYouToSeeTheAnnouncementModel.email = email;
    },

    async sendAnEmailUrgingYouToSeeTheAnnouncementConfirm(objectWantSendMail) {
      this.showLoading();
      const api = new NotificationService();
      const response = await api.sendAnEmailUrgingYouToSeeTheAnnouncementAsync(objectWantSendMail);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `Gửi mail nhắc nhở thành công cho mail ${this.sendAnEmailUrgingYouToSeeTheAnnouncementModel.email}`
      );
      for(let i in this.notifyReport.emailsPeopleSend) {
        if (this.notifyReport.emailsPeopleSend[i] == this.sendAnEmailUrgingYouToSeeTheAnnouncementModel.email) {
          this.$set(this.currentSendMail, i, true);
        }
      }
    },

    async setNotifyReportAsync() {
      // Call Api
      this.showLoading();
      const api = new NotificationService();

      const response = await api.getNotificationsReportAsync({
        notificationId: this.guid
      });
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.notifyReport = response.data;
    },

    async setNotifyAsync() {
      // Call Api
      this.showLoading();
      const api = new NotificationService();

      const response = await api.getNotifyByIdAsync(this.guid);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.notify = response.data;
    },

  }
};
</script>

<style>
</style>