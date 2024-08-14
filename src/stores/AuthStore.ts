import { create } from 'zustand';
import AuthService, { currentUserProps, loginProps, registerProps } from '@/services/AuthService'

interface authStateProps {
    currentUser: currentUserProps | null,
    captchaLabel: string,
    message: string | null,
    login: (loginInfo: loginProps) => Promise<void>,
    logout: () => Promise<void>,
    register: (registerInfo: registerProps) => Promise<void>,
    syncUser: () => Promise<void>,
    fetchCaptcha: (type: "login" | "register") => Promise<void>,
    initialize: () => void,
}

const getUserFromLocalStorage = (): { username: string } | null => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

const useAuthStore = create<authStateProps>((set) => ({
    currentUser: getUserFromLocalStorage(),
    message: null,
    captchaLabel: '',

    // localStorage 获取值无法做到更新页面
    // 所以新建一个初始化方法
    initialize: () => {
        set({
            currentUser: getUserFromLocalStorage(),
        })
    },

    login: async (loginInfo) => {
        try {
            const response = await AuthService.login(loginInfo);
            if (response.code == 200) {
                localStorage.setItem('currentUser', JSON.stringify({ username: loginInfo.username }));
                set({
                    currentUser: { username: loginInfo.username },
                    message: response.msg,
                });
            } else {
                set({
                    currentUser: null,
                    message: response.msg,
                });
            }
        } catch (e) {
            set({ message: (e as Error).message });
        }
    },

    logout: async () => {
        try {
            const response = await AuthService.logout();
            if (response.code == 200) {
                localStorage.removeItem('currentUser');
                set({
                    currentUser: null,
                    message: response.msg,
                });
            }
        } catch (e) {
            set({ message: (e as Error).message });
        }
    },

    register: async (registerInfo) => {
        try {
            const response = await AuthService.register(registerInfo);
            if (response.code == 200) {
                set({
                    message: response.msg,
                });
            } else {
                set({
                    message: response.msg,
                });
            }
        } catch (e) {
            set({ message: (e as Error).message });
        }
    },

    syncUser: async () => {
        try {
            const response = await AuthService.syncUser();
            if (response.code == 200) {
                const userInfo = {
                    id: response.info.id,
                    username: response.info.username,
                    nickname: response.info.nickname,
                    avatar: response.info.avatar,
                    email: response.info.email,
                    mobile: response.info.mobile
                }
                localStorage.setItem('currentUser', JSON.stringify(userInfo));
                set({
                    currentUser: userInfo,
                    message: response.msg,
                });
            } else {
                set({
                    currentUser: null,
                    message: response.msg,
                });
            }
        } catch (e) {
            set({ message: (e as Error).message });
        }
    },

    fetchCaptcha: async (type: "login" | "register") => {
        try {
            const response = await AuthService.fetchCaptcha(type);
            if (response.code == 200) {
                set({
                    captchaLabel: response.info,
                })
            } 
        } catch (e) {
            set({ message: (e as Error).message });
        }
    }
}));

export default useAuthStore;