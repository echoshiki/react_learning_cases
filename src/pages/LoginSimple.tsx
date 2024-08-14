import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useToast } from "@/components/ui/use-toast"
import { PageTitle } from "@/components/PageTitle";

interface userProps {
    id?: number,
    username: string,
    nickname?: string,
    avatar?: string,
    email?: string,
    mobile?: string
}
// 接口地址
const baseUrl = 'http://webman.lc/app/user/';
// 请求获取验证码
const fetchCaptcha = async (captchaType: 'login' | 'register') => {
    try {
        const response = await axios.get(baseUrl + 'captcha/image/' + captchaType, {
            // 允许附带 cookie
            withCredentials: true,
            // 二进制格式
            responseType: 'arraybuffer'
        });
        // btoa() 方法用于将字符串数据转换为 Base64 数据
        const base64ImageData = btoa(
            // 通过一系列操作将二进制数据转换为字符串数据
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        return `data:image/png;base64,${base64ImageData}`;
    } catch(error) {
        throw new Error('获取验证码出错：' + error);  
    }
}

interface formProps {
    onLogin: ({}: loginSubmitProps  ) => void,
    onRegister: ({}: registerSubmitProps) => void,
}

const Form = ({onLogin, onRegister}: formProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaLabel, setCaptchaLable] = useState("");
    const [repassword, setRepassword] = useState("");
    const [nickname, setNickname] = useState("");
    // 判断显示登录还是注册
    const [isLogin, setIsLogin] = useState(true);

    // 刷新验证码
    const refreshCaptcha = () => {
        fetchCaptcha(isLogin ? 'login' : 'register').then(captcha => {
            setCaptchaLable(captcha);
        });
    }

    const onSubmit = () => {
        if (isLogin) {
            // 处理登录
            onLogin({
                username: username,
                password: password,
                captcha: captchaInput
            });
        } else {
            // 处理注册
            onRegister({
                username: username,
                password: password,
                repassword: repassword,
                nickname: nickname,
                captcha: captchaInput 
            });
        }
    }

    useEffect(() => {
        // 载入刷新验证码
        refreshCaptcha(); 
    }, [isLogin])

    return (
        <div>
            {isLogin ? (
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">登录</CardTitle>
                    <CardDescription>
                        输入您的账户与密码来登录系统
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">账户</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={username}
                                onChange={e=>setUsername(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">密码</Label>
                            </div>
                            <Input id="password"
                                type="password" 
                                placeholder="请输入密码"
                                value={password} 
                                onChange={e=>setPassword(e.target.value)}
                                required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex flex-nowrap items-center space-x-2">
                                <img src={captchaLabel} onClick={refreshCaptcha} alt="" />
                                <Input id="captcha"
                                    type="text" 
                                    placeholder="请输入验证码"
                                    value={captchaInput} 
                                    onChange={e=>setCaptchaInput(e.target.value)}
                                    required />
                            </div>    
                        </div>
                        <Button onClick={onSubmit} className="w-full">
                            立即登录
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        还没有账户？{" "}
                        <a onClick={() => setIsLogin(!isLogin)} className="underline">
                            现在就注册
                        </a>
                    </div>
                </CardContent>
            </Card>
            ) : (
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">注册</CardTitle>
                    <CardDescription>
                        输入您的注册信息来加入我们
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">账户</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={username}
                                onChange={e=>setUsername(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">密码</Label>
                            </div>
                            <Input id="password"
                                type="password" 
                                placeholder="请输入密码"
                                value={password} 
                                onChange={e=>setPassword(e.target.value)}
                                required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="repassword">重复密码</Label>
                            </div>
                            <Input id="repassword"
                                type="password" 
                                placeholder="请再次输入密码"
                                value={repassword} 
                                onChange={e=>setRepassword(e.target.value)}
                                required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">昵称</Label>
                            <Input
                                id="nickname"
                                type="text"
                                placeholder="nickname"
                                value={nickname}
                                onChange={e=>setNickname(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex flex-nowrap items-center space-x-2">
                                <img src={captchaLabel} onClick={refreshCaptcha} alt="" />
                                <Input id="captcha"
                                    type="text" 
                                    placeholder="请输入验证码"
                                    value={captchaInput} 
                                    onChange={e=>setCaptchaInput(e.target.value)}
                                    required />
                            </div>    
                        </div>
                        <Button  onClick={onSubmit} className="w-full">
                            立即注册
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        已经有账户？{" "}
                        <a onClick={() => setIsLogin(!isLogin)} className="underline">
                            现在就登录
                        </a>
                    </div>
                </CardContent>
            </Card>
            )}
        </div>
    )
}

interface myProps {
    currentUser: userProps,
    onLogout: () => void,
    onFetchUser: () => void
}

const My = ({currentUser, onLogout, onFetchUser}: myProps) => {
    return (
        <div>
            <PageTitle title="个人中心" message="登录后可见的个人资料页面" />
            {currentUser.id ? (
                <div className="w-2/3 flex items-center space-x-10 mb-3 text-sm">
                    <div className="w-24 h-24 rounded-sm overflow-hidden pb-5">
                        <img src={currentUser.avatar} alt=""/>
                    </div>
                    <div className="w-60">
                        <p className="border-b py-2">ID: <span>{currentUser.id ? currentUser.id : '待获取'}</span></p>
                        <p className="border-b py-2">用户名：<span>{currentUser.username}</span></p>
                        <p className="border-b py-2">昵称：<span>{currentUser.nickname ? currentUser.nickname : '待获取'}</span></p>
                        <p className="border-b py-2">邮箱：<span>{currentUser.email ? currentUser.email : '待获取'}</span></p>   
                        <p className="border-b py-2">手机号：<span>{currentUser.mobile ? currentUser.mobile : '待获取'}</span></p> 
                    </div>
                </div>
            ) : (
                <p className="font-light">你好，{currentUser.username}</p>
            )}
            <div className="flex items-center space-x-5 py-5">
                <Button className="bg-orange-600 text-xs" onClick={onFetchUser}>同步信息</Button>
                <p><a onClick={onLogout} className="underline cursor-pointer text-sm">安全退出</a></p>
            </div>  
        </div>
    );
}

interface loginSubmitProps {
    username: string,
    password: string,
    captcha: string
}

interface registerSubmitProps {
    username: string,
    password: string,
    repassword: string,
    captcha: string,
    nickname: string
}

export default () => {
    // 用于判断是否已经登录
    const [currentUser, setCurrentUser] = useState<userProps|null>(null);
    const { toast } = useToast()

    const handleLogin = async (loginInfo: loginSubmitProps) => {
        const response = await axios.post(baseUrl + 'login', {
            username: loginInfo.username,
            password: loginInfo.password,
            image_code: loginInfo.captcha
        }, { withCredentials: true });
        if (response.data.code == 0) {
            // 登录成功，返回 {code:0, msg: "ok"}
            toast({
                title: "提醒",
                description: "登录成功",
            });
            // 不修改后端，只存入前端的用户名
            localStorage.setItem('currentUser', JSON.stringify({ username: loginInfo.username }));
            setCurrentUser({
                username: loginInfo.username,
            });
        } else {
            toast({
                variant: "destructive",
                title: "错误",
                description: response.data.msg,
            });
        }
    }

    const handleLogout = async () => {
        await axios.post(baseUrl + 'login/logout', {}, {
            withCredentials: true,
        }).then(() => {
            toast({
                title: "提醒",
                description: "用户已登出",
            });
            // 登出，清空前端的状态变量和本地化存储
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
        })
    }

    const handleRegister = async (registerInfo: registerSubmitProps) => {
        const response = await axios.post(baseUrl + 'register', {
            username: registerInfo.username,
            password: registerInfo.password,
            repassword: registerInfo.repassword,
            nickname: registerInfo.nickname,
            image_code: registerInfo.captcha
        }, { withCredentials: true });
        if (response.data.code == 0) {
            toast({
                title: "提醒",
                description: "用户注册成功！",
            });
            localStorage.removeItem('currentUser');
            window.location.reload();
        } else {
            toast({
                variant: "destructive",
                title: "错误",
                description: response.data.msg,
            });
        }
    }

    const handleFetchUser = async () => {
        const response = await axios.get('http://webman.lc/app/formhelper/api/profile', { withCredentials: true });
        if (response.data.code == 0) {
            toast({
                title: "提醒",
                description: "获取用户信息成功！",
            });
            const userInfo = {
                id: response.data.info.id,
                username: response.data.info.username,
                nickname: response.data.info.nickname,
                avatar: response.data.info.avatar,
                email: response.data.info.email,
                mobile: response.data.info.mobile
            }
            setCurrentUser(userInfo);
            localStorage.setItem('currentUser', JSON.stringify(userInfo));
        } else {
            toast({
                variant: "destructive",
                title: "错误",
                description: response.data.msg,
            });
            setCurrentUser(null);
            localStorage.removeItem('currentUser');
        }
    }

    useEffect(() => {
        // 载入时候判断是否已经登录
        // 登录就把用户信息存入本地存储
        const user = localStorage.getItem('currentUser');
        setCurrentUser(user ? JSON.parse(user) : null);
    }, []);

    return (
        <div>
            {currentUser ? (
                <My currentUser={currentUser} 
                    onLogout={handleLogout} 
                    onFetchUser={handleFetchUser}/>
                    
            ) : (
                <Form onLogin={handleLogin} onRegister={handleRegister} />
            )}
        </div>
    )
}

// // 初次练习版
// import axios from "axios"
// import { useEffect, useState } from "react";

// interface userProps {
//     id: number,
//     username: string,
//     nickname: string,
//     avatar: string,
//     email: string,
//     mobile: string,
// }

// interface loginFormProps {
//     onLogin: ({username, password, captcha}: loginProps) => void,
//     switchForm: (isLogin: boolean) => void,
// }

// const LoginForm = ({onLogin, switchForm}: loginFormProps) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [captchaInput, setCaptchaInput] = useState('');
//     const [captchaLabel, setCaptchaLabel] = useState('');

//     // 声明一个获取验证码的异步函数（async）
//     // 异步函数会返回一个 Promise
//     const fetchCaptcha = async () => {
//         try {
//             // await 会暂停函数执行，直到 axios.get 请求完成，并返回响应数据
//             const response = await axios.get('http://webman.lc/app/user/captcha/image/login', {
//                 responseType: 'arraybuffer',
//                 withCredentials: true
//             });
//             // btoa() 方法用于将字符串数据转换为 Base64 数据
//             const base64ImageData = btoa(
//                 // 通过一系列操作将二进制数据转换为字符串数据
//                 new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
//             );
//             const catpchaUrl = `data:image/png;base64,${base64ImageData}`;
//             setCaptchaLabel(catpchaUrl);       
//         } catch (error) {
//             console.error('验证码获取出错:', error);
//         }
//     }

//     function handleSubmit() {
//         const loginInfo = {
//             username: username,
//             password: password,
//             captcha: captchaInput
//         }
//         onLogin(loginInfo);
//     }

//     useEffect(() => {
//         // 页面载入的时候请求获取验证码
//         fetchCaptcha();
//     }, []);

//     return (
//         <div>
//             <div className="flex space-x-2 items-center m-2">
//                 <span className="w-40">账户</span>
//                 <input type="text" className="border p-2" value={username} onChange={e => setUsername(e.target.value)} />
//             </div>
//             <div className="flex space-x-2 items-center m-2">
//                 <span className="w-40">密码</span>
//                 <input type="password" className="border p-2" value={password} onChange={e => setPassword(e.target.value)} />
//             </div>
//             <div className="flex space-x-2 items-center m-2">
//                 <span className="w-40"><img src={captchaLabel} onClick={fetchCaptcha} /></span>
//                 <input type="text" className="border p-2" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} />
//             </div>
//             <div>
//                 <button className="w-52 border border-gray-900 leading-loose mt-5" onClick={handleSubmit}>登录</button> 
//                 <p className="py-2 text-sm ">还没有账户？现在就<a onClick={() => switchForm(false)} className="underline">注册</a>!</p>
//             </div>   
//         </div>
//     );
// }

// interface registerFormProps {
//     onRegister: ({username, password, repassword, nickname, captcha}: registerProps) => void,
//     switchForm: (isLogin: boolean) => void,
// }

// const RegisterForm = ({onRegister, switchForm}: registerFormProps) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [nickname, setNickname] = useState('');
//     const [repassword, seRepassword] = useState('');
//     const [captchaInput, setCaptchaInput] = useState('');
//     const [captchaLabel, setCaptchaLabel] = useState('');

//     const fetchCaptcha = async () => {
//         try {
//             // await 会暂停函数执行，直到 axios.get 请求完成，并返回响应数据
//             const response = await axios.get('http://webman.lc/app/user/captcha/image/register', {
//                 responseType: 'arraybuffer',
//                 withCredentials: true
//             });
//             // btoa() 方法用于将字符串数据转换为 Base64 数据
//             const base64ImageData = btoa(
//                 // 通过一系列操作将二进制数据转换为字符串数据
//                 new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
//             );
//             const catpchaUrl = `data:image/png;base64,${base64ImageData}`;
//             setCaptchaLabel(catpchaUrl);       
//         } catch (error) {
//             console.error('验证码获取出错:', error);
//         }
//     }

//     function handleSubmit() {
//         const registerInfo = {
//             username: username,
//             password: password,
//             repassword: repassword,
//             nickname: nickname,
//             captcha: captchaInput
//         }
//         onRegister(registerInfo);
//     }

//     useEffect(() => {
//         fetchCaptcha();
//     }, []);

//     return (
//         <div>
//             <div className="flex space-x-2 items-center m-2">
//                 <span className="w-40">账户</span>
//                 <input type="text" className="border p-2" value={username} onChange={e => setUsername(e.target.value)} />
//             </div>
//             <div className="flex space-x-2 items-center m-2">
//                 <span className="w-40">密码</span>
//                 <input type="password" className="border p-2" value={password} onChange={e => setPassword(e.target.value)} />
//             </div>
//             <div className="flex space-x-2 items-center m-2">
//                 <span className="w-40">重复密码</span>
//                 <input type="password" className="border p-2" value={repassword} onChange={e => seRepassword(e.target.value)} />
//             </div>
//             <div className="flex space-x-2 items-center m-2">
//                 <span className="w-40">昵称</span>
//                 <input type="text" className="border p-2" value={nickname} onChange={e => setNickname(e.target.value)} />
//             </div>
//             <div className="flex space-x-2 items-center m-2">
//                 <span className="w-40"><img src={captchaLabel} onClick={fetchCaptcha} /></span>
//                 <input type="text" className="border p-2" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} />
//             </div>
//             <div>
//                 <button className="w-52 border border-gray-900 leading-loose mt-5" onClick={handleSubmit}>注册</button> 
//                 <p className="py-2 text-sm ">已经有账户了？现在就<a onClick={() => switchForm(true)} className="underline">登录</a>!</p>
//             </div>
//         </div>
//     )
// }

// interface MyProps {
//     userInfo: userProps
//     onLogout: () => Promise<void>
// }

// const My = ({userInfo, onLogout}: MyProps) => {
//     return (
//         <>
//             <p>欢迎回来, {userInfo.username}</p>
//             <button onClick={onLogout}>立即退出</button>
//         </>
//     )
// }

// interface loginProps {
//     username: string,
//     password: string,
//     captcha: string
// }

// interface registerProps {
//     username: string,
//     password: string,
//     repassword: string,
//     nickname: string,
//     captcha: string
// }

// export default () => {
//     const [currentUser, setCurrentUser] = useState<userProps|null>(null);
//     const [isLogin, setIsLogin] = useState(true);

//     const handleLogin = async ({username, password, captcha}: loginProps) => {
//         try {
//             const response = await axios.post('http://webman.lc/app/user/login', {
//                 username: username,
//                 password: password,
//                 image_code: captcha,
//             }, {
//                 withCredentials: true
//             });
//             // 验证成功后用户信息本地化存储

//             if (response.data.code === 0) {
//                 alert('登录成功');
//                 localStorage.setItem('user', JSON.stringify(response.data.user_info));
//                 setCurrentUser(response.data.user_info);
//             } else {
//                 alert(`错误: ${response.data.msg}`);
//             } 
//         } catch(error) {
//             throw new Error('登录出错：' + error);
//         }  
//     }

//     const handleLoginout = async () => {
//         await axios.post('http://webman.lc/app/user/logout', {}, {
//             withCredentials: true,
//         });
//         localStorage.removeItem('user');
//         setCurrentUser(null);
//     }  
    
//     const handleRegister = async ({username, password, repassword, nickname, captcha}: registerProps) => {
//         try {
//             if (password !== repassword) {
//                 alert('两次密码输入不一致！');
//                 return;
//             }
//             const response = await axios.post('http://webman.lc/app/user/register', {
//                 username: username,
//                 password: password,
//                 nickname: nickname,
//                 image_code: captcha,
//             }, {
//                 withCredentials: true
//             });
//             if (response.data.code === 0) {
//                 alert('注册成功');
//                 setIsLogin(true);
//             } else {
//                 alert(`错误: ${response.data.msg}`);
//             }
//         } catch(error) {
//             throw new Error('注册出错：' + error);
//         }  
//     }

//     useEffect(() => {
//         const user = localStorage.getItem('user');
//         setCurrentUser(user ? JSON.parse(user) : null);
//     }, [])

//     return (
//         <>
//             {currentUser ? (
//                 <My userInfo={currentUser} onLogout={handleLoginout} />
//             ) : (
//                 <>
//                 {isLogin ? (
//                     <LoginForm onLogin={handleLogin} switchForm={setIsLogin} />
//                 ) : (
//                     <RegisterForm onRegister={handleRegister} switchForm={setIsLogin} />
//                 )}
//                 </>   
//             )}
//         </> 
//     )
// }