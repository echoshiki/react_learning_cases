import { PageTitle } from "@/components/PageTitle"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"


import { currentUserProps, loginProps, registerProps } from "@/services/AuthService"
import useAuthStore from "@/stores/AuthStore"
import { useEffect, useRef, useState } from "react"

interface loginFormProps {
	onLogin: (loginInfo: loginProps) => void,
	refreshCaptcha: (tab: string) => void,
	captchaLabel: string,
}

const LoginForm = ({onLogin, refreshCaptcha, captchaLabel}: loginFormProps) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [captchaInput, setCaptchaInput] = useState('');
	return (
		<Card>
			<CardHeader>
				<CardTitle>登录</CardTitle>
				<CardDescription>
					输入用户名与密码，现在就登录平台
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="space-y-1">
					<Label htmlFor="name">账户/邮箱</Label>
					<Input id="name" placeholder="account@hotmail.com" onChange={e => setUsername(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="password">密码</Label>
					<Input id="password" type="password" onChange={e => setPassword(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="password">验证码</Label>
					<div className="flex flex-nowrap items-center space-x-2">
						<img src={captchaLabel} onClick={() => refreshCaptcha('login')} alt="" />
						<Input id="captcha"
							type="text" 
							placeholder="请输入验证码"
							onChange={e => setCaptchaInput(e.target.value)}
							required />
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={() => onLogin({username: username, password: password, captcha: captchaInput})}>登录</Button>
			</CardFooter>
		</Card>
	)
}

interface registerFormProps {
	onRegister: (registerInfo: registerProps) => void,
	refreshCaptcha: (tab: string) => void,
	captchaLabel: string,
}

const RegisterForm = ({onRegister, refreshCaptcha, captchaLabel}: registerFormProps) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [repassword, setRePassword] = useState('');
	const [captchaInput, setCaptchaInput] = useState('');
	return (
		<Card>
			<CardHeader>
				<CardTitle>加入我们</CardTitle>
				<CardDescription>
					输入一些简单的信息后立即加入我们！
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="space-y-1">
					<Label htmlFor="username">账户</Label>
					<Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="password">密码</Label>
					<Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="current_password">重复密码</Label>
					<Input id="current_password" type="password" value={repassword} onChange={e => setRePassword(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="password">验证码</Label>
					<div className="flex flex-nowrap items-center space-x-2">
						<img src={captchaLabel} onClick={() => refreshCaptcha('register')} alt="" />
						<Input id="captcha"
							type="text" 
							value={captchaInput}
							placeholder="请输入验证码"
							onChange={e => setCaptchaInput(e.target.value)}
							required />
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={() => onRegister({username: username, password: password, repassword: repassword, captcha: captchaInput})}>注册</Button>
			</CardFooter>
		</Card>
	)
}

interface MyProps {
	currentUser: currentUserProps,
	onLogout: () => Promise<void>,
	onSyncUser: () => Promise<void>,
}

const My = ({currentUser, onLogout, onSyncUser}: MyProps) => {
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
                <Button className="bg-orange-600 text-xs" onClick={onSyncUser}>同步信息</Button>
                <p><a onClick={onLogout} className="underline cursor-pointer text-sm">安全退出</a></p>
            </div>  
        </div>
	)
}

export default () => {
	const { currentUser, initialize, login, logout, register, syncUser, message, fetchCaptcha, captchaLabel } = useAuthStore();
	const messageRef = useRef(message);
	const { toast } = useToast();

	useEffect(() => {
		// 初始化更新
		initialize();
		fetchCaptcha('login');
	}, []);

	useEffect(() => {
		messageRef.current = message
	}, [message]);

	useEffect(() => {
		console.log(currentUser);
	}, []);

	const handleLogin = async (loginInfo: loginProps) => {
		try {
			await login(loginInfo);
			toast({
				title: '提醒',
				description: messageRef.current
			});
		} catch(e) {
			toast({
				variant: "destructive",
				title: '错误',
				description: (e as Error).message
			});
		}		
	}

	const handleLogout = async () => {
		try {
			await logout();
			toast({
				title: '提醒',
				description: messageRef.current
			});
		} catch(e) {
			toast({
				variant: "destructive",
				title: '错误',
				description: (e as Error).message
			});
		}
	}

	const handleRegister = async (registerInfo: registerProps) => {
		try {
			await register(registerInfo);
			toast({
				title: '提醒',
				description: messageRef.current
			});
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} catch(e) {
			toast({
				variant: "destructive",
				title: '错误',
				description: (e as Error).message
			});
		}
	}	

	const handleSyncUser = async () => {
		try {
			await syncUser();
			toast({
				title: '提醒',
				description: messageRef.current
			});
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} catch(e) {
			toast({
				variant: "destructive",
				title: '错误',
				description: (e as Error).message
			});
		}
	}

	const refreshCaptcha = (tab: string) => {
		tab == "login" ? fetchCaptcha('login') : fetchCaptcha('register');
	}

	return (
		<>
		{!currentUser ? (
			<Tabs defaultValue="login" className="w-[400px]" onValueChange={ tab => refreshCaptcha(tab) }>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="login">登录</TabsTrigger>
					<TabsTrigger value="register">注册</TabsTrigger>
				</TabsList>
				<TabsContent value="login">
					<LoginForm onLogin={handleLogin} 
							refreshCaptcha={refreshCaptcha}  
							captchaLabel={captchaLabel} />
				</TabsContent>
				<TabsContent value="register">
					<RegisterForm onRegister={handleRegister} 
								refreshCaptcha={refreshCaptcha} 
								captchaLabel={captchaLabel} />
				</TabsContent>
			</Tabs>
		) : (
			<My currentUser={currentUser} onLogout={handleLogout} onSyncUser={handleSyncUser} />
		)}
		</>
	)
}


