import { useViewContext } from "./ViewContext";


export default function ShopItem({ item, catDict }) {
  const viewContext = useViewContext();
  const itemCategory = catDict[item.itemType];

  return (
    <>
      <li className={`${viewContext.view === '' ? 'inline ' : (viewContext.view === itemCategory ? 'inline ' : 'hidden ')} 
      border-2 flex flex-col w-44 h-96`}
      >
        <img src={item.images.url} alt={`${item.title}`} />
        <div>{item.title}</div>
        <div>{itemCategory}</div>
        <div>{item.price}</div>
        <div className="overflow-hidden">{item.description}</div>
      </li>
    </>
  )
}
