import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('pages/DashboardPage.vue')
      },
      {
        path: '/students',
        name: 'Students',
        component: () => import('pages/StudentsPage.vue')
      },
      {
        path: '/students/pending',
        name: 'PendingStudents',
        component: () => import('pages/PendingStudentsPage.vue')
      },
      {
        path: '/exams',
        name: 'Exams',
        component: () => import('pages/ExamsPage.vue')
      },
      {
        path: '/exams/create',
        name: 'CreateExam',
        component: () => import('pages/CreateExamPage.vue')
      },
      {
        path: '/exams/:id/edit',
        name: 'EditExam',
        component: () => import('pages/EditExamPage.vue')
      },
      {
        path: '/exams/results',
        name: 'ExamResults',
        component: () => import('pages/ExamResultsPage.vue')
      },
      {
        path: '/materials',
        name: 'Materials',
        component: () => import('pages/MaterialsPage.vue')
      },
      {
        path: '/materials/upload',
        name: 'UploadMaterials',
        component: () => import('pages/UploadMaterialsPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
