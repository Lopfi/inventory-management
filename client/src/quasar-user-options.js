import "./styles/quasar.sass";
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import { Notify, Dialog } from "quasar";
// To be used on app.use(Quasar, { ... })
export default {
  config: {},
  plugins: {
    Notify,
    Dialog,
  },
};
