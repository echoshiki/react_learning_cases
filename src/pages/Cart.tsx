import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/PageTitle";

// 元数据
const productListData = [
    { id: 1, categoryId: 1, price: 1, stock: 10, sold: 0, name: "苹果" },
    { id: 2, categoryId: 1, price: 2, stock: 10, sold: 0, name: "火龙果" },
    { id: 3, categoryId: 2, price: 2, stock: 10, sold: 0, name: "青菜" },
    { id: 4, categoryId: 3, price: 2, stock: 10, sold: 0, name: "猪肉" },
    { id: 5, categoryId: 2, price: 2, stock: 10, sold: 0, name: "芹菜" },
    { id: 6, categoryId: 2, price: 2, stock: 10, sold: 0, name: "胡萝卜" },
    { id: 7, categoryId: 3, price: 2, stock: 10, sold: 0, name: "羊肉" },
    { id: 8, categoryId: 1, price: 4, stock: 10, sold: 0, name: "百香果" },
    { id: 9, categoryId: 2, price: 4, stock: 10, sold: 0, name: "南瓜" },
    { id: 10, categoryId: 3, price: 1, stock: 10, sold: 0, name: "牛肉" },
    { id: 11, categoryId: 1, price: 2, stock: 10, sold: 0, name: "西瓜" },
    { id: 12, categoryId: 2, price: 2, stock: 10, sold: 0, name: "卷心菜" },
    { id: 13, categoryId: 1, price: 2, stock: 10, sold: 0, name: "西柚" },
    { id: 14, categoryId: 2, price: 2, stock: 10, sold: 0, name: "菠菜" },
    { id: 15, categoryId: 1, price: 2, stock: 10, sold: 0, name: "橙子" },
    { id: 16, categoryId: 1, price: 2, stock: 10, sold: 0, name: "榴莲" },
    { id: 17, categoryId: 2, price: 2, stock: 10, sold: 0, name: "茄子" },
    { id: 18, categoryId: 1, price: 2, stock: 10, sold: 0, name: "蜜桃" },
    { id: 19, categoryId: 2, price: 2, stock: 10, sold: 0, name: "大白菜" },
    { id: 20, categoryId: 1, price: 2, stock: 10, sold: 0, name: "葡萄" },
];

const categoryListData = [
    {id: 1, category: "水果", color: "bg-[#ff9800]"},
    {id: 2, category: "蔬菜", color: "bg-[#8bc34a]"},
    {id: 3, category: "肉类", color: "bg-[#f44336]"},
];

interface productProps {
    id: number,
    categoryId: number,
    price: number,
    stock: number,
    sold: number,
    name: string
}

interface categoryProps {
    id: number,
    category: string,
    color: string,
}

// 产品列表单项组件
interface productItemProps {
    productItem: productProps,
    getCategory: (categoryId: number) => categoryProps,
    onPlusCart: (itemId: number) => void,
}

function ProductItem({productItem, getCategory, onPlusCart}: productItemProps) {
    const productCategory = getCategory(productItem.categoryId);
    return (
        <div className="flex py-3 border-b justify-between items-center">
            <div className="w-52">
                <p className="text-sm font-bold">{productItem.name}</p>
                <div className="flex space-x-2 text-xs text-gray-400 font-light">
                    <span>库存：{productItem.stock ? productItem.stock : '已售罄'}</span>
                    <span>销量：{productItem.sold}</span>
                </div>
            </div> 
            <Badge className={`${productCategory.color} text-xs text-white`}>{productCategory.category}</Badge>
            <span className="text-sm font-extrabold tracking-tight">${productItem.price}</span>   
            <Button className="text-xs h-8" onClick={() => onPlusCart(productItem.id)}> 加入购物车 </Button>   
        </div>
    );
}

// 产品列表组件
interface productListProps {
    productList: productProps[],
    getCategory: (categoryId: number) => categoryProps,
    selectedCategory: number,
    searchText: string,
    onlyStocked: boolean,
    onPlusCart: (itemId: number) => void,
}

function ProductList({productList, getCategory, selectedCategory, searchText, onlyStocked, onPlusCart}: productListProps) {
    const row: JSX.Element[] = [];
    // 匹配过滤搜索关键词
    productList.filter(item => (!selectedCategory || item.categoryId == selectedCategory) && item.name.toLowerCase().indexOf(searchText.toLowerCase()) != -1).map((item, index) => {
        if (item.stock == 0 && onlyStocked) return;
        row.push(
            <ProductItem key={index}
                        getCategory={getCategory}
                        productItem={item} 
                        onPlusCart={onPlusCart} />
        )
    });
    return (
        <ScrollArea className="h-72 rounded-md border px-4 py-2">
            {row}
        </ScrollArea>
    );
}

// 搜索栏组件
interface searchBarProps {
    categoryList: categoryProps[],
    setselectedCategory: (categoryId: string) => void,
    searchText: string,
    setsearchText: (text: string) => void,
    onlyStocked: boolean,
    setonlyStocked: (stocked: boolean) => void,
}

function SearchBar({categoryList, setselectedCategory, searchText, setsearchText, onlyStocked, setonlyStocked}: searchBarProps) {
    return (
        <div>
            <div className="flex space-x-1">
                <Select onValueChange={setselectedCategory}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {categoryList.map(item => (
                                <SelectItem key={item.id} value={item.id.toString()}>{item.category}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <input type="text"
                    className="border-b border-gray-300 text-black w-full py-1 outline-none placeholder:font-light text-sm indent-2"
                    placeholder="请输入商品关键词..."
                    value={searchText}
                    onChange={e => setsearchText(e.target.value)} />
            </div>
            <div className="flex space-x-1 py-3 items-center">
                <Checkbox id="onlyStocked" 
                            checked={onlyStocked}
                            onCheckedChange={setonlyStocked} />
                <label
                    htmlFor="onlyStocked"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    只显示有库存的商品
                </label>
            </div>
        </div>
    )
}

interface cartProductProps {
    productId: number,
    count: number,
}

// 购物单项组件
interface cartItemProps {
    cartItem: cartProductProps,
    productItem: productProps,
    onPlusCart: (itemId: number) => void, 
    onMinusCart: (itemId: number) => void,
}

function CartItem({cartItem, productItem, onPlusCart, onMinusCart}: cartItemProps) {
    return (
        <div className="flex py-2 border-t justify-between items-center">
            <div className="w-36">
                <p className="text-sm font-bold">{productItem.name}</p>
            </div> 
            <span className="text-sm text-gray-400 font-extrabold tracking-tight">${productItem.price} x {cartItem.count}</span> 
            <div className="flex space-x-1">
                <Button size="icon" className="text-xs w-6 h-6" onClick={() => onPlusCart(cartItem.productId)}> + </Button>   
                <Button size="icon" className="text-xs w-6 h-6" onClick={() => onMinusCart(cartItem.productId)}> - </Button> 
            </div>    
        </div>
    )
}

// 购物车列表组件
interface cartTableProps {
    cartList: cartProductProps[],
    getProduct: (productId: number) => productProps,
    onPlusCart: (itemId: number) => void, 
    onMinusCart: (itemId: number) => void,
}

function CartTable({cartList, getProduct, onPlusCart, onMinusCart}: cartTableProps) {
    return (
        <ScrollArea className="h-60">
            {cartList.length === 0 ? (
                <span className="text-gray-400 font-extrabold">购物车为空！</span>
            ) : cartList.map((item, index) => {
                const productItem = getProduct(item.productId);
                return (
                <CartItem key={index} 
                        cartItem={item}
                        productItem={productItem}
                        onPlusCart={onPlusCart}
                        onMinusCart={onMinusCart} />
                );
            })}
        </ScrollArea>
    )
}

// 购物车底部计算栏组件
function CartTotalBar({totalPrice}: {totalPrice: number}) {
    return (
        <div className="py-2">
            <p><span className="font-light text-sm">总金额：$</span>{totalPrice}</p>
        </div>
    )
}

// 总购物组件
interface cartProps {
    cartList: cartProductProps[],
    getProduct: (productId: number) => productProps,
    onPlusCart: (itemId: number) => void, 
    onMinusCart: (itemId: number) => void,
}

function Cart({cartList, getProduct, onPlusCart, onMinusCart}: cartProps) {
    // sum 累加器，0 为初始值
    const totalPrice = cartList.reduce((sum, item) => {
        const product = getProduct(item.productId);
        return sum + product.price * item.count;
    }, 0);
    return (
        <div>
            <p className="font-bold text-xl pb-2">购物车</p>
            {/* <div className="max-h-80 overflow-y-auto border-b"> */}
                <CartTable cartList={cartList}
                        getProduct={getProduct}
                        onPlusCart={onPlusCart}
                        onMinusCart={onMinusCart} />
            {/* </div> */}
            <CartTotalBar totalPrice={totalPrice} />
        </div>
    )
}

export default () => {
    const [selectedCategory, setselectedCategory] = useState<number>(0);
    const [searchText, setsearchText] = useState('');
    const [onlyStocked, setonlyStocked] = useState(false);
    // 购物车列表
    const [cartList, setcartList] = useState<cartProductProps[]>([]);
    const [productList, setproductList] = useState<productProps[]>(productListData);

    // 获取产品，定义默认值规避 undefined 报错
    const getProduct = (productId: number) => productList.find(product => product.id === productId) || { id: -1, categoryId: 0, price: 0, stock: 0, sold: 0, name: "Unknown" };
    // 获取分类
    const getCategory = (categoryId: number) => categoryListData.find(item => item.id === categoryId) || { id: -1, category: "未知分类", color: "#fff" };

    function handleselectedCategory(id: string) {
        setselectedCategory(Number(id));
    }

    function handlePlusCart(productId: number) {
        const productItem = getProduct(productId);
        // 库存为 0 的时候无法再加入购物车
        if (productItem && productItem.stock === 0) return;
        // 判断购物车内是否有该产品
        const hasItem = cartList.find(item => item.productId == productId);
        if (hasItem) {
            setcartList(cartList.map(item => (
                item.productId == productId ? {
                    ...item,
                    count: item.count + 1
                } : item
            )));
        } else {
            setcartList([
                ...cartList,
                {
                    productId: productId,
                    count: 1
                }
            ]);
        }
        // 改变库存和销量
        setproductList(productList.map(item => (
            item.id == productId ? {
                ...item,
                stock: item.stock - 1,
                sold: item.sold + 1
            } : item
        )));
    }

    function handleMinusCart(productId: number) {
        setcartList(cartList.filter(item => item.count != 1).map(item => (
            item.productId == productId ? {
                ...item,
                count: item.count - 1
            } : item      
        )));
        
        setproductList(productList.map(item => (
            item.id == productId ? {
                ...item,
                stock: item.stock + 1,
                sold: item.sold - 1
            } : item
        )));
    }

    return (
        <>
            <PageTitle title="购物车" message="商品展柜与购物车功能的模拟实现" />
            <div className="flex space-x-5">
                <div className="w-2/3">
                    <SearchBar searchText={searchText}
                                setsearchText={setsearchText}
                                onlyStocked={onlyStocked}
                                setonlyStocked={setonlyStocked}
                                categoryList={categoryListData}
                                setselectedCategory={handleselectedCategory} />
                    <ProductList productList={productList}
                                getCategory={getCategory}
                                selectedCategory={selectedCategory}
                                searchText={searchText}
                                onlyStocked={onlyStocked}
                                onPlusCart={handlePlusCart}  />
                </div>
                <div className="w-1/3 border rounded-sm p-5">
                    <Cart cartList={cartList}
                            getProduct={getProduct}
                            onPlusCart={handlePlusCart}
                            onMinusCart={handleMinusCart} />
                </div>
            </div>
        </>
    )
}