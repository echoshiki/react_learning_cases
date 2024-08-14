import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PageTitle } from "@/components/PageTitle";

function ProductRow({productData}: {productData: productProps}) {
    return (
        <TableRow className="text-left">
            <TableCell className={`${productData.stocked ? `` : `text-red-600`}`}>{productData.name}</TableCell>
            <TableCell>{productData.price}</TableCell>
        </TableRow>
    )
}

function ProductCategoryRow({category}: {category: string}) {
    return (
        <TableRow>
            <TableHead colSpan={2} className="text-center">{category}</TableHead>
        </TableRow>
    )
}

interface ProductTableProps {
    productListData: productProps[],
    filterText: string,
    inStockedOnly: boolean,
}

function ProductTable({productListData, filterText, inStockedOnly}: ProductTableProps) {
    let prevCategory: string;
    const rows: JSX.Element[] = [];
    productListData.filter(item=>(item.name.toLowerCase().indexOf(filterText.toLowerCase()) != -1)).map(item=>{
        if (item.category != prevCategory) {
            rows.push(
                <ProductCategoryRow category={item.category} key={item.category} />
            );
            prevCategory = item.category;
        }
        if (!item.stocked && inStockedOnly)  return;
        rows.push(
            <ProductRow productData={item} key={item.name} />
        )
    })

    // productListData.forEach((item) => {
    //     if (item.category != prevCategory) {
    //         rows.push(
    //             <ProductCategoryRow category={item.category} key={item.category} />
    //         );
    //         prevCategory = item.category;
    //     }
    //     if (item.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1 || (!item.stocked && inStockedOnly)) {
    //         return;
    //     }
    //     rows.push(
    //         <ProductRow productData={item} key={item.name} />
    //     )
    // })

    return (
        <Table className="mt-2 text-sm">
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows}
            </TableBody>
        </Table>
    )
}

interface searchBarProps {
    filterText: string,
    inStockedOnly: boolean,
    setfilterText: (filterText: string)=>void,
    setinStockedOnly: (inStockedOnly: boolean)=>void,
}

function SearchBar({filterText, inStockedOnly, setfilterText, setinStockedOnly}: searchBarProps) {
    return (
        <div>
            <Input className="rounded-none h-10" type="text" placeholder="Search..." value={filterText} onChange={(e)=>setfilterText(e.target.value)} />
            <div className="flex items-center justify-start my-2">
                <Checkbox className="rounded-none"
                        checked={inStockedOnly} 
                        onCheckedChange={setinStockedOnly} />
                <Label className="text-black font-light" htmlFor="">&nbsp;&nbsp;只显示有库存的商品</Label>
            </div>
        </div>
    )
}

export default function ProductListPanel() {
    const [filterText, setfilterText] = useState('');
    const [inStockedOnly, setinStockedOnly] = useState(false);

    return (
        <>
            <PageTitle title="商品列表" message="商品数据的展示与筛选" />
            <div className="w-96">
                <SearchBar 
                    filterText={filterText} 
                    inStockedOnly={inStockedOnly} 
                    setfilterText={setfilterText}
                    setinStockedOnly={setinStockedOnly} />
                <ProductTable 
                    productListData={productListData} 
                    filterText={filterText}
                    inStockedOnly={inStockedOnly} />
            </div>
        </>
    );
}

interface productProps {
    category: string,
    price: string,
    stocked: boolean,
    name: string
}

const productListData = [
    { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
    { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
    { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
    { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
    { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
    { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
];

// 初次写法
// import { useState } from "react";

// function ProductRow({productData}: {productData: productProps}) {
//     return (
//         <tr>
//             <td className={`${productData.stocked ? `` : `text-red-600`}`}>{productData.name}</td>
//             <td>{productData.price}</td>
//         </tr>
//     )
// }

// function ProductCategoryRow({category}: {category: string}) {
//     return (
//         <tr>
//             <th colSpan={2}>{category}</th>
//         </tr>
//     )
// }

// interface ProductTableProps {
//     productListData: productProps[],
//     filterText: string,
//     inStockedOnly: boolean
// }

// function ProductTable({productListData, filterText, inStockedOnly}: ProductTableProps) {
//     let prevCategory: string;
//     const rows: JSX.Element[] = [];
//     productListData.forEach((item) => {
//         if (item.category != prevCategory) {
//             rows.push(
//                 <ProductCategoryRow category={item.category} key={item.category} />
//             );
//             prevCategory = item.category;
//         }
//         if (item.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1 || (!item.stocked && inStockedOnly)) {
//             return;
//         }
//         rows.push(
//             <ProductRow productData={item} key={item.name} />
//         )
//     })
//     return (
//         <table className="">
//             <thead>
//                 <tr>
//                     <th>Name</th>
//                     <th>Price</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {rows}
//             </tbody>
//         </table>
//     )
// }

// interface searchBarProps {
//     filterText: string,
//     inStockedOnly: boolean,
//     setfilterText: (filterText: string)=>void,
//     setinStockedOnly: (inStockedOnly: boolean)=>void,
// }

// function SearchBar({filterText, inStockedOnly, setfilterText, setinStockedOnly}: searchBarProps) {
//     return (
//         <div>
//             <div><input type="text" placeholder="Search..." value={filterText} onChange={(e)=>setfilterText(e.target.value)} /></div>
//             <div className="flex">
//                 <input type="checkbox" checked={inStockedOnly} onChange={(e)=>setinStockedOnly(e.target.checked)} />
//                 <label htmlFor="">
//                     {'  '}
//                     Only show products in stock
//                 </label>
//             </div>
//         </div>
//     )
// }

// function ProductListPanel() {
//     const [filterText, setfilterText] = useState('');
//     const [inStockedOnly, setinStockedOnly] = useState(false);

//     return (
//         <div>
//             <SearchBar 
//                 filterText={filterText} 
//                 inStockedOnly={inStockedOnly} 
//                 setfilterText={setfilterText}
//                 setinStockedOnly={setinStockedOnly} />
//             <ProductTable 
//                 productListData={productListData} 
//                 filterText={filterText}
//                 inStockedOnly={inStockedOnly} />
//         </div>
//     );
// }

// export default function DataList() {
//   return (
//     <div>
//         <ProductListPanel />
//     </div>
//   )
// }

// interface productProps {
//     category: string,
//     price: string,
//     stocked: boolean,
//     name: string
// }

// const productListData = [
//     { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
//     { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
//     { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
//     { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
//     { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
//     { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
// ];
