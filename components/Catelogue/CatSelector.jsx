import { useViewContext, useViewDispatch } from "./ViewContext";

export default function CatSelector({ cat }) {
  const viewContext = useViewContext();
  const dispatch = useViewDispatch();

  return (
    <li>
      <button
        className={`${viewContext.view === cat && 'text-white'}`}
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
