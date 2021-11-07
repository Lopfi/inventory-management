import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Add from '../views/Add.vue'
import Scan from '../views/Scan.vue'
import Item from '../views/Item.vue'
import Location from '../views/Location.vue'
import Results from '../views/Results.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/results/:kind',
    name: 'Results',
    component: Results
  },
  {
    path: '/add/:kind',
    name: 'Add',
    component: Add
  },
  {
    path: '/scan',
    name: 'Scan',
    component: Scan
  },
  {
    path: '/item/:id',
    name: 'Item',
    component: Item,
  },
  {
    path: '/location/:id',
    name: 'Location',
    component: Location,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.name;
  next();
});

export default router
