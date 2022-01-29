import { createRouter, createWebHashHistory } from 'vue-router'
import Add from '../views/Add.vue'
import Scan from '../views/Scan.vue'
import Item from '../views/Item.vue'
import Location from '../views/Location.vue'
import Results from '../views/Results.vue'

const routes = [
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
    path: '/items/:id',
    name: 'Item',
    component: Item,
  },
  {
    path: '/locations/:id',
    name: 'Location',
    component: Location,
  },
]

const router = new createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.name;
  next();
});

export default router
