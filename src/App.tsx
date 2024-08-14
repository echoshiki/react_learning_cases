import { Routes, Route, Link } from "react-router-dom";

// 组件
import RootLayout from '@//layouts/RootLayout';
import Home from '@/pages/Home';
import Game from '@/pages/Game';
import Products from '@/pages/Products';
import Todos from '@/pages/Todos';
import Cart from '@/pages/Cart';
import Practise from '@/pages/Practise';
import LoginSimple from "@/pages/LoginSimple";
import LoginPlus from "@/pages/LoginPlus";

// 配置
import navigations from '@/config/navigations';

export default function App() {
    return (
		<RootLayout>
		<div className="flex space-x-6 py-5">
			<nav className="w-3/12 flex flex-col p-10 bg-indigo-600 rounded-sm">
				{navigations.map((n, i)=>(
					<div className="py-2 border-b" key={i}>
						<p className="text-sm text-slate-50 leading-loose hover:text-indigo-200"><Link to={n.url}> # {n.name} </Link></p>
					</div>
				))}
			</nav>
			<div className="p-10 w-9/12 h-[36rem] bg-white overflow-scroll">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/game" element={<Game />} />
					<Route path="/products" element={<Products />} />
					<Route path="/todos" element={<Todos />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="/login_simple" element={<LoginSimple />} />
					<Route path="/login_plus" element={<LoginPlus />} />
					<Route path="/practise" element={<Practise />} />
				</Routes>
			</div>                      
		</div> 
		</RootLayout>   
    )
}