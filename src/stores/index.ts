import { ref, Ref } from "vue";
import { Mesh, Tree } from "../types/index";

import { defineStore } from "pinia";
export default defineStore("index", () => {
  let current: Ref<any> = ref({});
  let tree: Ref<Tree> = ref({} as Tree);

  /**
   * 获得tree
   * @param model
   * @param ls
   */

  const getTree = (model, ls) => {
    if (model.children && model.children.length) {
      if (model.children.some(v => v.isMesh)) {
        model.children.forEach(e => {
          if (e.isMesh) {
            ls.push({ uuid: e.uuid, title: e.name, key: e.uuid, children: [] });
          }

          getTree(e, ls[ls.length - 1]?.children);
        });
      } else {
        model.children.forEach(e => {
          getTree(e, ls);
        });
      }
    }
  };

  return { current, tree, getTree };
});
