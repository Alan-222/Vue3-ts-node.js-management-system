import { AppState } from '@/utils/types/store/app';
import { localStorage } from '@/utils/storage';
import { createStore } from 'vuex';

const useAppStore = createStore({
  state: (): AppState => ({
    device: 'desktop',
    sidebar: {
      opened: localStorage.get('sidebarStatus') ? !!+localStorage.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    language: 'zh-cn',
    size: localStorage.get('size') || 'default'
  }),
  actions: {
    toggleSidebar({ commit, state }) {
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
      if (state.sidebar.opened) {
        localStorage.set('sidebarStatus', 1);
      } else {
        localStorage.set('sidebarStatus', 0);
      }
    },
    closeSideBar({ state }, withoutAnimation: any) {
      localStorage.set('sidebarStatus', 0);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    toggleDevice({ state }, device: string) {
      state.device = device;
    },
    setSize({ state }, size: string) {
      state.size = size;
      localStorage.set('size', size);
    },
    setLanguage({ state }, language: string) {
      state.language = language;
      localStorage.set('language', language);
    }
  }
});

export default useAppStore;
