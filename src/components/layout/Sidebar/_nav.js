export default [{
  _name: 'CSidebarNav',
  _children: [{
      _name: 'CSidebarNavItem',
      name: 'Lên kế hoạch',
      to: '/',
      icon: 'cil-speedometer',
      badge: {
        color: 'primary',
        text: 'NEW',
      },
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
      to: '/student-management',
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
      name: 'Quản lý khóa',
      to: '/course-management',
      icon: 'cil-star',
    },
    {
      _name: 'CSidebarNavItem',
      name: 'Quản lý lớp',
      to: '/class-management',
      icon: 'cil-bell',
    },
  ],
}, ];