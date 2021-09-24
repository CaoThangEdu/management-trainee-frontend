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
              v-if="faq.text == 'ListTrainingSystemManagementComponent'"
            >
              <ListTrainingSystemManagementComponent 
                @change-training-system="changeTrainingSystem" />
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
import ListTrainingSystemManagementComponent from "../../../components/TrainingSystemManagementComponent/ListTrainingSystemManagementComponent/ListTrainingSystemManagementComponent";
import ListCareerManagementComponent from "../../../components/CareerManagementComponent/ListCareerManagementComponent/ListCareerManagementComponent";
export default {
  components: {
    ListTrainingSystemManagementComponent,
    ListCareerManagementComponent,
  },
  data() {
    return {
      faqs: [
        {
          title: "Danh sách hệ",
          text: "ListTrainingSystemManagementComponent",
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
</style>