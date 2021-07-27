export default [{
  _name: 'CSidebarNav',
  _children: [{
    _name: 'CSidebarNavDropdown',
    name: 'Lên kế hoạch',
    router: '/plan',
    icon: 'cil-speedometer',
    items: [{
        name: 'Danh sách kế hoạch',
        to: '/plan/list'
      }, {
        name: "Thêm mới kế hoạch",
        to: '/plan/create'
      },
    ]
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Phân công giáo viên',
    to: '/teacher-assignment',
    icon: 'cil-drop',
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Duyệt phiếu giới thiệu',
    to: '/confirm-referra-file',
    icon: 'cil-pencil',
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Quản lý thực tập sinh viên',
    to: '/student-management-internships',
    icon: 'cil-cursor',
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Quản lý công ty',
    to: '/company-management',
    icon: 'cil-puzzle',
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Quản lý sinh viên',
    to: '/student-management/list',
    icon: 'cil-user',
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Quản lý giáo viên',
    to: '/teacher-management',
    icon: 'cil-chart-pie',
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Quản lý hệ - ngành',
    to: '/trainingsystem-management',
    icon: 'cil-calculator',
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Quản lý lớp',
    to: '/class-management',
    icon: 'cil-bell',
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Quản lý thông báo',
    to: '/notification-management',
    icon: 'cil-bell',
  },
  {
    _name: 'CSidebarNavItem',
    name: 'Đăng ký giấy giới thiệu thực tập',
    to: '/registered-intership-referrals',
    icon: 'cil-pencil',
},
{
  _name: 'CSidebarNavItem',
  name: 'Xác nhận thực tập',
  to: '/internship-confirmation',
  icon: 'cil-pencil',
},
  ],
}, ];
