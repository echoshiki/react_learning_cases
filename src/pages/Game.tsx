import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PageTitle } from "@/components/PageTitle";

interface squareProps {
    isWinnerSquare: boolean,
    onSquareClick: () => void,
    children: string | null,
}

// 方格
function Square({children, isWinnerSquare, onSquareClick}: squareProps) {
    return <Button variant="outline" size="icon" className={`w-20 h-20 rounded-none font-extrabold text-3xl ${isWinnerSquare ? 'bg-indigo-800 text-slate-50' : ''}`} onClick={onSquareClick}>{children}</Button>
}

interface boardProps {
    currentSquares: Array<string|null>,
    winnerSquares: Array<number|null>,
    handleSquareClick: (i: number) => void,
}

// 棋盘
function Board({currentSquares, winnerSquares, handleSquareClick}: boardProps) {
    return (
        <>
            <div className="w-60 h-60 grid grid-cols-3">
                {currentSquares.map((square, index) => (
                    <Square key={index} isWinnerSquare={winnerSquares.includes(index)} onSquareClick={() => handleSquareClick(index)}>{square}</Square>
                ))}
            </div>
        </>
    );
}

interface recordProps {
    history: Array<Array<string | null>>,
    jumpTo: (index: number) => void,
}

// 历史记录
function Record({history, jumpTo}: recordProps) {
    return (
        <div className="flex flex-col">
            {history.map((_squares: (string|null)[], index: number) => (
                <a href="#" key={index} onClick={() => jumpTo(index)} className="underline">
                    #{index}. {index > 0 ? `跳至第 ${index} 步` : `跳至最开始`}
                </a>
            ))}
        </div>
    )
}

// 游戏组件
export default function Game() {
    const [history, setHistory] = useState<Array<Array<string | null>>>([Array(9).fill(null)]);
    const [currentMove, setcurrentMove] = useState(0);
    const currentSquares = history[currentMove];
    const isxNext = currentMove % 2 === 0;
    const winnerInfo = calculateWinner({currentSquares});
    const winnerSquares = winnerInfo ? winnerInfo.winnerSquares : [];

    const message = getMessage({winnerInfo, isxNext, currentMove});

    function handlePlay(nextSquare: Array<null|string>) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquare];
        setHistory(nextHistory);
        setcurrentMove(nextHistory.length - 1);
    }

    function handleSquareClick(i: number) {
        if (currentSquares[i] ||winnerInfo) return;
        const nextSquares = currentSquares.slice();
        nextSquares[i] = isxNext ? 'X' : 'O';
        handlePlay(nextSquares);
    }

    function handleJump(i: number) {
        setcurrentMove(i);
    }
    
    return (
        <>
        <PageTitle title="趣味小游戏：井字棋" message={message} />
        <div className="flex space-x-10">
            <Board currentSquares={currentSquares} handleSquareClick={handleSquareClick} winnerSquares={winnerSquares} />
            <Record history={history} jumpTo={handleJump} />
        </div>
        </>
    )
}

interface getMessageProps {
    winnerInfo: {
        winner: string | null,
        winnerSquares: number[],
    } | null,
    currentMove: number,
    isxNext: boolean, 
}

function getMessage({winnerInfo, currentMove, isxNext}: getMessageProps): string {
    if (winnerInfo) return `恭喜！本轮游戏的赢家是：${winnerInfo.winner}`;
    switch (currentMove) {
        case 0: 
            return `游戏开始，走棋的选手是：X`;
        case 9: 
            return `游戏结束，平局`;
        default: 
            return `下一位走棋的选手是：${isxNext ? 'X' : 'O'}`;
    } 
}

interface calculateWinnerProps {
    currentSquares: (string | null)[]
}

function calculateWinner({currentSquares}: calculateWinnerProps) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (let index = 0; index < lines.length; index++) {
        const [a, b ,c] = lines[index];
        if (currentSquares[a] && currentSquares[a] === currentSquares[b] && currentSquares[a] === currentSquares[c]) {
            return {
                winner: currentSquares[a],
                winnerSquares: lines[index]
            }
        }  
    }
    return null;
}


// 初次写法
// import { useState } from 'react'
// import { Button } from '@/components/ui/button'

// // 方格组件
// // 传入显示的东西、点击触发的事件
// function Square({value, onSquareClick, showWinnerSquare}: any) {
//     return <Button variant="outline" size="icon" className={`w-24 h-24 rounded-none p-0 text-3xl font-bold ${showWinnerSquare ? 'bg-green-500 text-slate-200' : ''}`}
//     onClick={ onSquareClick }> {value}</Button>
// }

// // 棋盘组件
// // 传入下一步的玩家、当前布局、更新函数
// function Board({ xIsNext, squares, onPlay, winSquares }: any) {

//     function handleClick(i: number) {
//         // 在每次点击之前检测该方块是否已经被点击或者检测是否有胜负
//         // 满足以上任一条件，都不再执行该方法
//         if (squares[i] || calculateWinner(squares)) {
//             return;
//         }
//         // 复制一份 squares 的副本数组
//         const nextSquares = squares.slice();
//         if (xIsNext) {
//             nextSquares[i] = 'X';
//         } else {
//             nextSquares[i] = 'O';
//         }
//         onPlay(nextSquares);
//     }

//     const board = squares.map((square: string[], index: number) => {
//         const isWinnerIndex = winSquares.includes(index);
//         return <Square showWinnerSquare={isWinnerIndex} key={index} value={square} onSquareClick={() => handleClick(index)}></Square>
//     }) 

//     return (
//         <>     
//             <div className="grid grid-cols-3">
//                {board}
//             </div>
//         </>
//     )
// }

// export default function Game() {
//     // 记录棋盘的布局历，九个数组
//     const [history, setHistory] = useState([Array(9).fill(null)]);
//     // 当前步骤
//     const [currentMove, setcurrentMove] = useState(0);
//     // 记录 X 的状态，实现交替落子
//     // const [xIsNext, setxIsNext] = useState(true);
//     const xIsNext = currentMove % 2 === 0 ? true : false;
//     // 当前布局
//     const currentSquare = history[currentMove];

//     // 更新对象
//     function handlePlay(nextSquares: any) {
//         // 根据 history 创建新的数组，并将 nextSquares 添加进去
//         const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
//         setHistory(nextHistory);
//         setcurrentMove(nextHistory.length - 1);
//         setjumpInfo(null);
//     }

//     const moves = history.map((_squares, move) => {
//         let description;
//         if (move > 0) {
//             description = 'Go to move #' + move;
//         } else {
//             description = 'Go to game start #' + move;
//         }
//         return <div key={move}><Button onClick={() => jumpTo(move)} className="w-52 mb-2 bg-slate-500">{description}</Button></div>
//     })

//     const [jumpInfo, setjumpInfo] = useState(null as any);

//     function jumpTo(nextMove: number) {
//         setcurrentMove(nextMove);
//         setjumpInfo('🪐 Jump to move #' + nextMove);
//     }

//     const winnerInfo = calculateWinner(currentSquare);  
//     let status;
//     let winSquares;
//     if (winnerInfo) {
//         status = '🎉 Winner: ' + winnerInfo[0];
//         winSquares = winnerInfo[1];
//     } else {
//         status = '🤔 Next player: ' + (xIsNext ? 'X' : 'O');
//     }

//     return (
//         <>
//             <div className="flex flex-nowrap space-x-10">
//                 <div>
//                     <div className="text-2xl mb-5">{status}</div>
//                     {/* 传递给组件 Board 下一步该哪边走 / 当前布局是怎样的 / 更新函数 */}
//                     <Board xIsNext={xIsNext} squares={currentSquare} onPlay={handlePlay} winSquares={winSquares ? winSquares : []}  />
//                     <div className="text-2xl mt-5 min-h-10">{jumpInfo}</div>
//                 </div>
//                 <div>
//                     {moves}
//                 </div>
//             </div>
            
//         </>
//     )
// }

// function calculateWinner(squares: Array<number>) {
//     // 八种赢法组合
//     const lines = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8],
//         [0, 4, 8],
//         [2, 4, 6],
//     ];
//     // 遍历所有的赢法，检测是否获胜
//     for (let i = 0; i < lines.length; i++) {
//         // 获取每个赢法的三个方格
//         const [a, b, c] = lines[i];
//         // 判断三个方格是否都有值
//         // 如果有值，则判断是否相等
//         // 如果相等，则返回赢家
//         if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//             return [squares[a], lines[i]];
//         }
//     }
//     // 如果没有赢家，返回 null           
//     return null;
// }

