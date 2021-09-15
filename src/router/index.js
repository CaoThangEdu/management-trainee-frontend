import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  //homePage
  {
    path: "/",
    name: "home",
    component: () =>
      import(
        "../router/views/Home/Home.vue"
      ),
    meta: {
      breadcrumbName: 'Trang chủ'
    },
  },
  // template mail
  {
    path: "/template-mail",
    name: "template-mail",
    component: () =>
      import(
        "../components/common/template-mail/TemplateMail.vue"
      ),
    meta: {
      breadcrumbName: 'Template mail'
    },
  },
  //404
  {
    path: '*',
    name: '404',
    component: () =>
      import('./views/page-404/Page404.vue'),
    meta: {
      hideSidebar: true,
      hideHeader: true,
      hideFooter: true
    }
  },
  {
    path: "/plan",
    name: "len-ke-hoach",
    redirect: '/plan/list',
    component: {
      render(c) {
        return c('router-view');
      }
    },
    meta: {
      breadcrumbName: 'Lên kế hoạch'
    },
    children: [{
      path: 'list',
      name: 'ds-ke-hoach',
      component: () =>
        import("../router/views/Plan/Plan.vue"),
      meta: {
        breadcrumbName: 'Danh sách',
      },
    },
    {
      path: 'create',
      name: 'them-ke-hoach',
      component: () =>
        import("../components/PlanComponent/PlanDetail/PlanDetail.vue"),
      meta: {
        breadcrumbName: 'Thêm mới',
      },
    },
    {
      path: 'update/:guid',
      name: 'sua-ke-hoach',
      props: true,
      component: () =>
        import("../components/PlanComponent/PlanDetail/PlanDetail.vue"),
      meta: {
        breadcrumbName: 'Chỉnh sửa',
      },
    },
  ]
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(
        "../router/views/LoginPage/LoginPage.vue"
      ),
    meta: {
      hideSidebar: true,
      hideHeader: true
    },
  },
  {
    path: "/change-password",
    name: "changePassword",
    component: () =>
      import(
        "../router/views/ChangePasswordPage/ChangePasswordPage.vue"
      ),
      meta: {
        breadcrumbName: "Đổi mật khẩu",
      },
  },
  {
    path: "/user-manage",
    name: "user-manage",
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        "../router/views/UserManagement/UserManagement.vue"
      ),
    meta: {
      breadcrumbName: "Quản lý tài khoản",
    },
  },
  {
    path: "/teacher-assignment",
    name: "phan-cong-giao-vien",
    redirect: '/teacher-assignment/list',
    component: {
      render(c) {
        return c('router-view');
      }
    },
    meta: {
      breadcrumbName: 'Phân công giáo viên'
    },
    children: [{
      path: 'list',
      name: 'phan-cong-giao-vien',
      component: () =>
        import("../router/views/TeacherAssignment/TeacherAssignment.vue"),
      meta: {
        breadcrumbName: 'Danh sách',
      },
    },
    {
      path: 'assignment/:internshipCourseId',
      name: 'phan-cong-dot',
      props: true,
      component: () =>
        import("../components/TeacherAssignmentComponent/Assignment/Assignment.vue"),
      meta: {
        breadcrumbName: 'Phân công',
      },
    },
  ]
  },
  {
    path: "/confirm-referra-file",
    name: "duyet-phieu-gioi-thieu",
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        "../router/views/ConfirmReferralFile/ConfirmReferralFile.vue"
      ),
    meta: {
      breadcrumbName: "Duyệt phiếu giới thiệu",
    },
  },
  {
    path: "/student-management-internships",
    name: "quan-ly-thuc-tap-sinh-vien",
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        "../router/views/StudentManagementInternships/StudentManagementInternships.vue"
      ),
    meta: {
      breadcrumbName: "Quản lý thực tập sinh viên",
    },
  },
  {
    path: "/company-management",
    name: "quan-ly-cong-ty",
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        "../router/views/CompanyManagement/CompanyManagement.vue"
      ),
    meta: {
      breadcrumbName: "Quản lý công ty",
    },
  },
  {
    path: "/notification-management",
    name: "quan-ly-thong-bao",
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        "../router/views/NotificationManagement/NotificationManagement.vue"
      ),
    meta: {
      breadcrumbName: "Quản lý thông báo",
    },
  },
  {
    path: "/trainingsystem-management",
    name: "quan-ly-he",
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        "../router/views/TrainingSystemManagement/TrainingSystemManagement.vue"
      ),
    meta: {
      breadcrumbName: "Quản lý hệ - ngành",
    },
  },
  {
    path: "/career-management",
    name: "quan-ly-nganh",
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        "../router/views/CareerManagement/CareerManagement.vue"
      ),
    meta: {
      breadcrumbName: "Quản lý khóa",
    },
  },
  {
    path: "/class-management",
    name: "quan-ly-lop",
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        "../router/views/ClassManagement/ClassManagement.vue"
      ),
    meta: {
      breadcrumbName: "Quản lý lớp",
    },
  },
  {
    path: "/student-management",
    name: "quan-ly-sinh-vien",
    redirect: '/student-management/list',
    component: {
      render(c) {
        return c('router-view');
      }
    },
    meta: {
      breadcrumbName: 'Sinh viên'
    },
    children: [{
        path: 'list',
        name: 'ds-sinh-vien',
        component: () =>
          import("../router/views/StudentManagement/StudentManagement.vue"),
        meta: {
          breadcrumbName: 'Danh sách',
        },
      },
      {
        path: 'create/:guid',
        name: 'them-sv-cua-dot',
        props: true,
        component: () =>
          import("../router/views/StudentByPlan/StudentByPlan.vue"),
        meta: {
          breadcrumbName: 'Thêm mới',
        },
      },
    ]
  },
  {
    path: "/teacher-management",
    name: "quan-ly-giao-vien",
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        "../router/views/TeacherManagement/TeacherManagement.vue"
      ),
    meta: {
      breadcrumbName: "Quản lý giáo viên",
    },
  },
  {
    path: '/certificate-management',
    name: 'Đăng ký giấy giới thiệu thực tập',
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        '../router/views/Certificate/Certificate.vue'
      ),
    meta: {
      breadcrumbName: 'Đăng ký giấy giới thiệu thực tập',
    },
  },
  {
    path: '/internship-confirmation',
    name: 'Xác nhận thực tập',
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        '../router/views/InternshipConfirmation/InternshipConfirmation.vue'
      ),
    meta: {
      breadcrumbName: 'Xác nhận thực tập',
    },
  },
  {
    path: '/upload-file',
    name: 'Upload file',
    component: () =>
      import(
        /* webpackChunkName: "ControlExample" */
        '../router/views/UploadFile/UploadFile.vue'
      ),
    meta: {
      breadcrumbName: 'Upload file',
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

router.afterEach(() => {
  // setIsLoadingInStore(false)
});

router.beforeEach((to, from, next) => {
  let tokenKey = localStorage.getItem('AUTH_TOKEN');
  // If user is authenticated || 'to' is not LoginPage => Direct
  if (tokenKey || to.name === 'login') {
    // user is authenticated.
    next();
  } else {
    next({
      name: 'login'
    });
  }
});

export default router;
