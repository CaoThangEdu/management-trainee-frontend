<template>
  <div>
    <CertificatesComponent :isAdmin="isAdmin" />
  </div>
</template>

<script>
import CertificatesComponent from "../../../components/CertificateManagementComponent/CertificatesComponent/CertificatesComponent.vue";
export default {
  components: { CertificatesComponent },
  data() {
    return {
      isAdmin: true,
    };
  },
};
</script>
