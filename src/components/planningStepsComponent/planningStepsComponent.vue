<template>
  <div class="row book-steps">
    <div class="col-sm-12 breadcrumb-wrap hidden-sm-down p-0">
      <div class="booking-step">
        <div class="row">
          <div class="col-sm-6 col-md-4">
            <div
              :class="{ active: isActive === '1' }"
              class="booking-step__item"
            >
              <div class="number"><span>1</span></div>
              <p class="text">Tạo kế hoạch</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-4">
            <div
              :class="{ active: isActive === '2' }"
              class="booking-step__item"
            >
              <div class="number"><span>2</span></div>
              <p class="text">Thêm sinh viên</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-4">
            <div
              :class="{ active: isActive === '3' }"
              class="booking-step__item"
            >
              <div class="number"><span>3</span></div>
              <p class="text">Phân công giáo viên</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookSteps",
  props: {
    isActiveStep: String,
  },
  data() {
    return {
      isActive: this.isActiveStep,
    };
  },
};
</script>

<style lang="scss">
.breadcrumb-wrap {
  background: white;
  .booking-step {
    background: white;
    border: solid 1px #3c4b64;
    padding: 5px;

    .active {
      color: #0d86ff;

      .number {
        border: solid 2px #0d86ff;
      }
    }
    &__item {
      box-sizing: border-box;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      min-height: 40px;
      margin: 0 auto;
      padding-left: 50px;
      position: relative;
      font-size: 17px;
      font-weight: 700;

      .number {
        position: absolute;
        top: 1px;
        left: 1px;
        display: inline-block;
        width: 40px;
        height: 40px;
        border: solid 2px #3c4b64;
        border-radius: 30%;
        text-align: center;
        padding: 6px;
        margin-top: 5px;
      }

      .text {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
