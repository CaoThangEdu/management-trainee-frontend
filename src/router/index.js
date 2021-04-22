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
];

const router = new VueRouter({
    mode: 'hash',
    routes,
});

router.afterEach(() => {
    // setIsLoadingInStore(false)
});

export default router;