<template>
  <nav aria-label="Page navigation example" v-show="totalPage >= 1">
    <ul :class="`pagination justify-content-` + position">
      <li
        class="page-item"
        :class="{disabled:(currentPage == startLoop ? `disabled`:``)}"
        @click="currentPage = previousPage"
      >
        <a class="page-link" href="javascript:void(0);">Trước</a>
      </li>

      <div class="d-flex" v-if="startLoop > 2">
        <li class="page-item" @click="currentPage = 1">
          <a class="page-link no-border-radius" href="javascript:void(0);">1</a>
        </li>
        <li class="page-item">
          <a class="page-link no-border-radius">...</a>
        </li>
      </div>

      <li
        class="page-item"
        v-for="i in range(startLoop, endLoop)"
        :key="i"
        :class="{active: (currentPage == i)}"
        @click="currentPage = i"
      >
        <a class="page-link" href="javascript:void(0);">{{i}}</a>
      </li>

      <div class="d-flex" v-if="endLoop != totalPage">
        <li class="page-item">
          <a class="page-link no-border-radius">...</a>
        </li>
        <li class="page-item" @click="currentPage = totalPage">
          <a class="page-link no-border-radius" href="javascript:void(0);">{{totalPage}}</a>
        </li>
      </div>
      <li
        class="page-item"
        :class="{disabled:(currentPage == endLoop ? `disabled` :``)}"
        @click="currentPage = nextPage"
      >
        <a class="page-link" href="javascript:void(0);">Sau</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    page: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    position: {
      type: String,
      default: "left", //left, center, end
    },
    totalItems: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      currentPage: this.page,
      startLoop: 1,
      endLoop: 1, //default loop
      totalPage: 10,
    };
  },
  methods: {
    changePage(index) {
      this.currentPage = index;
      this.$emit("change-page", this.currentPage);
    },
    range(start, end) {
      let tempTotalPage = this.calcTotalPage;
      let tempStartLoop = this.startLoop;
      let tempEndLoop = this.endLoop;

      if (this.currentPage > 7) {
        tempStartLoop = this.currentPage - 3;
        if (tempTotalPage > this.currentPage + 3) {
          tempEndLoop = this.currentPage + 3;
        } else if (
          this.currentPage <= tempTotalPage &&
          this.currentPage > tempTotalPage - 5
        ) {
          tempStartLoop = tempTotalPage - 5;
          tempEndLoop = tempTotalPage;
        }
      } else {
        if (tempEndLoop > 7) {
          tempEndLoop = 7;
          tempStartLoop = 1;
        }
      }
      this.totalPage = tempTotalPage;
      this.startLoop = tempStartLoop;
      this.endLoop = tempEndLoop;
      return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
    },
  },
  computed: {
    calcTotalPage() {
      let temp = this.totalItems / this.pageSize;

      if (Number.isInteger(temp) && temp > 0) {
        return Math.floor(temp);
      }

      return Math.floor(temp + 1);
    },
    previousPage() {
      if (this.currentPage < 2) {
        return 1;
      }
      return this.currentPage - 1;
    },
    nextPage() {
      if (this.currentPage > this.endLoop - 1) {
        return this.currentPage;
      }
      return this.currentPage + 1;
    },
  },
  watch: {
    page() {
      this.currentPage = this.page;
    },
    currentPage() {
      this.changePage(this.currentPage);
    },
    totalItems() {
      this.endLoop = this.calcTotalPage;
    },
    pageSize() {
      this.endLoop = this.calcTotalPage;
    },
  },
  mounted() {
    this.endLoop = this.calcTotalPage;
  },
};
</script>

<style lang="scss" scoped>
.no-border-radius {
  border-radius: 0 !important;
}

.navigation {
  .pagination {
    .page-item {
      &:active {
        .page-link {
          z-index: 1;
          color: #fff;
          background-color: #007bff;
          border-color: #007bff;
        }
      }
    }
  }
}
</style>