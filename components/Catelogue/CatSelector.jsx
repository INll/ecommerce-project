import { useViewContext, useViewDispatch } from "./ViewContext";

export default function CatSelector({ cat }) {
  const viewContext = useViewContext();
  const dispatch = useViewDispatch();

  return (
    <li className="px-[4%] md:px-0 md:w-25 border-r-0 border-zinc-500 last:border-r-0">
      <button
        className={`${viewContext.view === cat && 'text-white'} md:w-16 `}
        onClick={() => {
          if (viewContext.view === cat) {
            dispatch({
              type: 'changeView',
              cat: ''
            })
          } else {
            dispatch({
              type: 'changeView',
              cat: cat
            })  
          }
        }}
      >{cat}</button>
    </li>
  )
}
