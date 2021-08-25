<template>
  <div class="row">
    <div class="col-12">
      <div class="wrapCollapse">
        <div v-for="(faq, i) in faqs" :key="i">
          <dt>
            <a href="#" :class="{ active: currentFaq == i }" @click="openComponet(i)">
              {{ faq.title }}
            </a>
          </dt>
          <dd :class="{ active: currentFaq == i }"
            >
            <div
              class="col-xl-12 col-md-12 col-sm-12 col-12"
              v-if="faq.text == 'UserManagementComponent'"
            >
              <UserManagementComponent  />
            </div>
            <div
              class="col-xl-12 col-md-12 col-sm-12 col-12"
              v-if="faq.text == 'ListCareerManagementComponent'"
            >
              <ListCareerManagementComponent 
                v-if="renderCareerComponent" />
            </div>
          </dd>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserManagementComponent from "../../../components/UserManagementComponent/UserManagementComponent.vue"
import ListCareerManagementComponent from "../../../components/CareerManagementComponent/ListCareerManagementComponent/ListCareerManagementComponent";
export default {
  components: {
    UserManagementComponent,
    ListCareerManagementComponent,
  },
  data() {
    return {
      faqs: [
        {
          title: "Quản lý tài khoản",
          text: "UserManagementComponent",
        },
        {
          title: "Danh sách ngành",
          text: "ListCareerManagementComponent",
        },
      ],
      currentFaq: 0,
      renderCareerComponent: true,
    };
  },

  methods: {
    openComponet(i) {
      this.currentFaq = i;
    },
    changeTrainingSystem() {
      this.renderCareerComponent = false;
      this.$nextTick(() => {
        this.renderCareerComponent = true;
      });
    },
  },
};
</script>

<style lang="scss">
.wrapCollapse {
  dt {
    display: block;
    a {
      display: block;
      padding: 15px;
      background-color: #adadad;
      color: #fff;
      &:hover {
        text-decoration: none;
      }
      &.active {
        background-color: #3c6382;
        color: #fff;
      }
    }
  }
  dd {
    padding: 0 20px;
    height: 0;
    transition: all 0.5s ease;
    overflow: hidden;
    opacity: 0;
    &.active {
      height: auto;
      padding: 10px 0px;
      opacity: 1;
    }
  }
}
</style>