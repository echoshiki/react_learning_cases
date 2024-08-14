import { useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

let id = 1;

interface todoProps {
    id: number,
    title: string,
    done: boolean
}

interface todoItemProps {
    todoItem: todoProps,
    onRemoveTodo: (item: todoProps) => void,
    onEditTodo: (item: todoProps) => void,
}

function TodoItem({todoItem, onRemoveTodo, onEditTodo}: todoItemProps) {

    const [showEdit, setshowEdit] = useState(false);
    const [editText, seteditText] = useState(todoItem.title);

    function editDone(checked: boolean) {
        const newTodoItem = {
            ...todoItem,
            done: checked
        }
        onEditTodo(newTodoItem);   
    }

    function editTitle(text: string) {
        const newTodoItem = {
            ...todoItem,
            title: text ? text : todoItem.title
        }
        onEditTodo(newTodoItem);
        setshowEdit(showEdit => !showEdit);
    }

    return (
        <>
            {showEdit ? (
                <div className="flex justify-start space-x-2">
                    <input type="text" 
                            className={`border-b outline-none`}
                            value={editText}
                            onChange={e => seteditText(e.target.value)} />
                    <button className={`bg-black text-slate-50 w-8 h-8`} 
                            onClick={() => editTitle(editText)} > ok </button>
                </div>
            ) : (
                <div className="flex space-x-2 my-1">
                    <input type="checkbox" 
                        checked={todoItem.done}
                        onChange={e=>editDone(e.target.checked)} />
                    <span className={`${todoItem.done ? 'line-through' : ''}`}>{todoItem.title}</span>
                    <div className="flex space-x-1 underline">
                        <button onClick={() => setshowEdit(true)}>修改</button>
                        <button onClick={() => onRemoveTodo({...todoItem})}>删除</button>
                    </div>
                </div>
            )}
        </>
    );
}

interface todoTableProps {
    todoList: todoProps[],
    onRemoveTodo: (item: todoProps) => void,
    onEditTodo: (item: todoProps) => void,
}

function TodoTable({todoList, onRemoveTodo, onEditTodo}: todoTableProps) {
    return (
        <div className="w-96 mt-5">
            {todoList.length == 0 ? (
                <Alert>
                <AlertTitle>提示</AlertTitle>
                <AlertDescription>
                    暂时没有任何计划
                </AlertDescription>    
            </Alert>
            ):(
                <>
                    {todoList.map((item, index) => (
                        <TodoItem key={index}
                                todoItem={item}        
                                onRemoveTodo={onRemoveTodo}
                                onEditTodo={onEditTodo} />
                    ))}
                </>
            )}
        </div>
    );
}

interface addTodoProps {
    addText: string,
    setaddText: (text: string) => void,
    onAddTodo: (todoTitle: string) => void,
}

function AddTodoPanel({addText, setaddText, onAddTodo}: addTodoProps) {
    return (
        <div className="flex justify-start space-x-2">
            <input type="text" 
                    className={`border-b outline-none`}
                    value={addText}
                    onChange={e => setaddText(e.target.value)} />
            <button className={`bg-black text-slate-50 w-8 h-8`} onClick={() => onAddTodo(addText)}> + </button>
        </div>
    )
}

export default () => {
    const [addText, setaddText] = useState('');
    const [todoList, settodoList] = useState<todoProps[]>([]);
    function hanldeAddTodo(todoTitle: string) {
        settodoList([...todoList, {
            id: id++,
            title: todoTitle,
            done: false
        }]);
        // 清空搜索栏
        setaddText('');
    }

    function handleRemoveTodo(removeTodo: todoProps) {
        settodoList(todoList.filter(item => item.id !== removeTodo.id)); 
    }

    function handleEditTodo(newTodo: todoProps) {
        settodoList(todoList.map(item => {
            if (item.id === newTodo.id) {
                return newTodo;
            }
            return item;
        }));
    }

    return (
        <>
        <PageTitle title={`计划任务`} message="可以添加、修改以及删除任务的小程序练习" />
        <div>
            <AddTodoPanel  addText={addText}
                        setaddText={setaddText}
                        onAddTodo={hanldeAddTodo} />
            <TodoTable todoList={todoList} 
                    onRemoveTodo={handleRemoveTodo} 
                    onEditTodo={handleEditTodo} />
        </div>
        </>
    )
}

// // 二次写法
// import { useState } from "react";
// import PageHeader from "./layouts/PageHeader";

// type todo = {
//     id: number,
//     title: string,
//     done: boolean
// }

// const todosData: todo[] = [];
// let nextId = 0;

// interface addTodoPanelProps {
//     handleAddTodo: (todoTitle: string) => void,
// }

// function AddTodoPanel({handleAddTodo}: addTodoPanelProps) {
//     const [title, setTitle] = useState('');
//     const onAddTodo = () => {
// 		// 检查是否为空
// 		if (title.trim() === '') return;
//         setTitle('');
//         handleAddTodo(title);
//     }
//     return (
//         <div>
//             <input 
//                 type="text" 
//                 placeholder="输入你的计划..." 
//                 value={title}
//                 onChange={e=>setTitle(e.target.value)} />
//             <button onClick={onAddTodo}>提交</button>
//         </div>
//     )
// }

// interface todoProps {
//     todo: todo,
// 	handleSaveTodo: (t: todo) => void,
//     handleRemoveTodo: (todoId: number) => void,
// }

// function Todo({todo, handleSaveTodo, handleRemoveTodo}: todoProps) {
//     const [isEditing, setIsEditing] = useState(false);
// 	const [tempTitle, setTempTitle] = useState(todo.title);

//     const onEditTodo = () => {
//         setIsEditing(true);
//     }

// 	// 参数 1：修改的属性，title or done
// 	// 参数 2：可选，参数 1 为 done 时，才有意义
// 	// 传递一个修改后的 todo 对象给 handleSaveTodo()
// 	const onSaveTodo = (prop: 'title' | 'done', checked?: boolean) => {
// 		handleSaveTodo({
// 			...todo,
// 			[prop]: prop === 'done' ? checked : tempTitle,
// 		})
// 		setIsEditing(false);
// 	}

// 	const onCancelTodo = () => {
// 		setTempTitle(todo.title);
// 		setIsEditing(false);
// 	}

// 	const onRemoveTodo = () => {
// 		handleRemoveTodo(todo.id);
// 	}

//     return (
//         <div className="flex">
//             {!isEditing ? (
//             <>
//                 <input 
//                     type="checkbox" 
//                     checked={todo.done}
// 					onChange={e => onSaveTodo('done', e.target.checked)} />
//                 <label className={`${todo.done&&'line-through'}`}>{todo.title}</label>
//                 <div className="">
//                     <button onClick={onEditTodo}>编辑</button>
//                     <button onClick={onRemoveTodo}>删除</button>
//                 </div>
//             </>
//             ) : (
//             <>
//               	<input 
//                     type="text" 
//                     value={tempTitle}
// 					onChange={e => setTempTitle(e.target.value)} />
//                 <div className="">
//                     <button onClick={() => onSaveTodo('title')}>保存</button>
//                     <button onClick={onCancelTodo}>取消</button>
//                 </div>
//             </>  
//             )}
            
//         </div>
//     )
// }

// interface TodoListPanelProps {
//     todos: todo[],
// 	handleSaveTodo: (t: todo) => void,
//     handleRemoveTodo: (todoId: number) => void,
// }

// function TodoListPanel({todos, handleSaveTodo, handleRemoveTodo}: TodoListPanelProps) {
//     return (
// 		<>
// 			{todos.length == 0 ? (
// 				<>
// 					{`暂时还没有任何计划`}
// 				</>
// 			) : (
// 				<div>
// 					{todos.map(t => 
// 						<Todo 
// 							key={t.id} 
// 							todo={t} 
// 							handleSaveTodo={handleSaveTodo} 
// 							handleRemoveTodo={handleRemoveTodo} />
// 					)}
// 				</div>
// 			)}
// 		</>   
//     )
// }

// export default function TaskPanel() {
//     const [todos, setTodos] = useState(todosData);
//     const handleAddTodo = (todoTitle: string) => {
//         setTodos([
//             ...todos,
//             {
//                 id: nextId++,
//                 title: todoTitle,
//                 done: false
//             }
//         ])
//     }

// 	const handleSaveTodo = (newTodo: todo) => {
// 		setTodos(todos.map( t => {
// 			if (t.id === newTodo.id) {
// 				return newTodo;
// 			} 
// 			return t;
// 		}));
// 	}

// 	const handleRemoveTodo = (todoId: number) => {
// 		setTodos(todos.filter( t => (
// 			t.id !== todoId
// 		)))
// 	}	

//     return (
//         <>
//             <PageHeader pageTitle={`计划列表`} pageMessage={`一些需要记录的计划安排`}  />
//             <AddTodoPanel handleAddTodo={handleAddTodo} />
//             <TodoListPanel 
// 				todos={todos}
// 				handleSaveTodo={handleSaveTodo} 
// 				handleRemoveTodo={handleRemoveTodo} />
//         </>
//     )
// }


// // 初次写法
// import { useState } from "react";

// interface addTodoPanelProps {
//     onAddTodo: (todo: string) => void,
// }

// function AddTodoPanel({ onAddTodo }: addTodoPanelProps) {
//     const [newTodoValue, setnewTodoValue] = useState('');
//     return (
//         <>
//             <input 
//                 type="text" 
//                 placeholder="有什么新计划..." 
//                 value={newTodoValue} 
//                 onChange={e => setnewTodoValue(e.target.value)} />
//             <button onClick={() => {
//                     setnewTodoValue('');
//                     onAddTodo(newTodoValue);
//                 }}> 添加 </button>
//         </> 
//     )
// }

// type todo = {
//     id: number,
//     title: string,
//     done: boolean
// }

// interface todoProps {
//     todo: todo,
//     onChangeTodo: (newTodo: todo) => void,
//     onRemoveTodo: (todoId: number) => void,
// }

// function Todo({ todo, onChangeTodo, onRemoveTodo }: todoProps) {
//     const [isEditing, setisEditing] = useState(false);
//     const [tempTitle, settempTitle] = useState(todo.title);
//     return (
//         <div className="flex space-x-2 items-center">
//         {isEditing ? (
//             <>
//                 <input 
//                     type="text" 
//                     value={tempTitle} 
//                     onChange={e => settempTitle(e.target.value)} />
//                 <button 
//                     onClick={()=> {
//                         onChangeTodo({
//                             ...todo,
//                             title: tempTitle,
//                         });
//                         setisEditing(false);
//                 }}>保存</button>
//                 <button onClick={()=>{
//                     setisEditing(false);
//                 }}>取消</button>
//             </>
//         ) : (
//             <>
//                 <input type="checkbox" checked={todo.done} onChange={e => {
//                     onChangeTodo({
//                         ...todo,
//                         done: e.target.checked
//                     });
//                 } } />
//                 <h2 className={`${todo.done && `line-through`}`}>{todo.title}</h2>
//                 <button onClick={()=>setisEditing(!isEditing)}>编辑</button>
//                 <button onClick={() => onRemoveTodo(todo.id)}>删除</button>
//             </>
//         )}
//         </div>
//     )
// }

// let nextId = 0;

// export default function TodosList() {
//     const [todos, setTodos] = useState<todo[]>([]);
    
//     function handleAddTodo(newTodoTitle: string) {
//         setTodos([
//             ...todos,
//             {
//                 id: nextId++,
//                 title: newTodoTitle,
//                 done: false
//             }
//         ])
//     }

//     function handleChangeTodo(newTodo: todo) {
//         const nextTodos = todos.map(t=>{
//             if(t.id === newTodo.id) {
//                 return newTodo;
//             }
//             return t;
//         });
//         setTodos(nextTodos);
//     }

//     function handleRemoveTodo(todoId: number) {
//         setTodos(todos.filter(t => (
//             t.id != todoId
//         )))
//     }

//     return (
//         <>
//             <AddTodoPanel onAddTodo={handleAddTodo} />
//             <div>
//                 {todos.map(todo => 
//                 <Todo 
//                     key={todo.id} 
//                     todo={todo} 
//                     onChangeTodo={handleChangeTodo}
//                     onRemoveTodo={handleRemoveTodo} />
//                 )}
//             </div>
//         </>
//     )
// }