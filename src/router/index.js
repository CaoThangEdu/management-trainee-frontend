import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  //homePage
  {
    path: '/',
    name: 'len-ke-hoach',
    component: () =>
      import ( /* webpackChunkName: "ControlExample" */ '../router/views/Plan/Plan.vue'),
    meta: {
      breadcrumbName: 'Lên kế hoạch',
    },
  },
  {
    path: '/teacher-assignment',
    name: 'phan-cong-giao-vien',
    component: () =>
      import (
        /* webpackChunkName: "ControlExample" */
        '../router/views/TeacherAssignment/TeacherAssignment.vue'
      ),
    meta: {
      breadcrumbName: 'Phân công giáo viên',
    },
  },
  {
    path: '/confirm-referra-file',
    name: 'duyet-phieu-gioi-thieu',
    component: () =>
      import (
        /* webpackChunkName: "ControlExample" */
        '../router/views/ConfirmReferralFile/ConfirmReferralFile.vue'
      ),
    meta: {
      breadcrumbName: 'Duyệt phiếu giới thiệu',
    },
  },
  {
    path: '/student-management-internships',
    name: 'quan-ly-thuc-tap-sinh-vien',
    component: () =>
      import (
        /* webpackChunkName: "ControlExample" */
        '../router/views/StudentManagementInternships/StudentManagementInternships.vue'
      ),
    meta: {
      breadcrumbName: 'Quản lý thực tập sinh viên',
    },
  },
  {
    path: '/company-management',
    name: 'quan-ly-cong-ty',
    component: () =>
    import(
      /* webpackChunkName: "ControlExample" */
      '../router/views/CompanyManagement/CompanyManagement.vue'
    ),
    meta: {
      breadcrumbName: 'Quản lý công ty',
    },
  },
  {
    path: '/notification-management',
    name: 'quan-ly-thong-bao',
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        '../router/views/NotificationManagement/NotificationManagement.vue'
      ),
    meta: {
      breadcrumbName: 'Quản lý thông báo',
    },
  },
  {
    path: '/course-management',
    name: 'quan-ly-nganh',
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        '../router/views/CourseManagement/CourseManagement.vue'
      ),
    meta: {
      breadcrumbName: 'Quản lý khóa',
    },
  },
  {
    path: '/trainingsystem-management',
    name: 'quan-ly-he',
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        '../router/views/TrainingSystemManagement/TrainingSystemManagement.vue'
      ),
    meta: {
      breadcrumbName: 'Quản lý khóa',
    },
  },
  {
    path: '/career-management',
    name: 'quan-ly-nganh',
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        '../router/views/CareerManagement/CareerManagement.vue'
      ),
    meta: {
      breadcrumbName: 'Quản lý khóa',
    },
  },
  {
    path: '/class-management',
    name: 'quan-ly-lop',
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        '../router/views/ClassManagement/ClassManagement.vue'
      ),
    meta: {
      breadcrumbName: 'Quản lý lớp',
    },
  },
  {
    path: '/student-management',
    name: 'quan-ly-sinh-vien',
    component: () =>
    import(
      /* webpackChunkName: "ControlExample" */
      '../router/views/StudentManagement/StudentManagement.vue'
    ),
    meta: {
      breadcrumbName: 'Quản lý sinh viên',
    },
  },
  {
    path: '/teacher-management',
    name: 'quan-ly-giao-vien',
    component: () =>
    import(
      /* webpackChunkName: "ControlExample" */
      '../router/views/TeacherManagement/TeacherManagement.vue'
    ),
    meta: {
      breadcrumbName: 'Quản lý giáo viên',
    },
  },
  {
    path: '/registered-intership-referrals',
    name: 'Đăng ký giấy giới thiệu thực tập',
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        '../router/views/RegisteredInternshipReferrals/RegisteredInternshipReferrals.vue'
      ),
    meta: {
      breadcrumbName: 'Đăng ký giấy giới thiệu thực tập',
    },
  },
];

const router = new VueRouter({
  mode: 'hash',
  routes,
});

router.afterEach(() => {
  // setIsLoadingInStore(false)
});

export default router;