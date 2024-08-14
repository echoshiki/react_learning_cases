type navItem = {
    name: string,
    url: string,
    target?: string,
}
const navigations: navItem[] = [
    {
        name: '首页',
        url: '/',
    },
    {
        name: '井字棋游戏',
        url: '/game',
    },
    {
        name: '产品筛选列表',
        url: '/products',
    },
    {
        name: '计划列表',
        url: '/todos',
    },
    {
        name: '购物车',
        url: '/cart',
    },
    {
        name: '登录与注册（简单）',
        url: '/login_simple',
    },
    {
        name: '登录与注册（进阶）',
        url: '/login_plus',
    },
    {
        name: '练习面板',
        url: '/practise',
    },
];

export default navigations;