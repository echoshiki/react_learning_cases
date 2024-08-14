export const PageTitle = ({title, message}: {title: string, message: string}) => {
    return (
        <div className="w-full">
            <h1 className="text-xl font-extrabold leading-loose">{title}</h1>
            <h3 className="text-sm font-light mb-8 border-b-[1px] pb-5 border-slate-500">提示信息：{message}</h3>
        </div>
    )
}