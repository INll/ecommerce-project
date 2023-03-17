import { useAuthDispatch, useAuthState } from "../../contexts";
import { useMutation } from "react-query";
import { useViewContext } from "./ViewContext";
import axios from "axios";

export default function ShopItem({ item, catDict }) {
  const viewContext = useViewContext();
  const itemCategory = catDict[item.itemType];

  const session = useAuthState();
  const dispatch = useAuthDispatch();

  const { mutate, isLoading } = useMutation(async (reqPayload) => {
    const path = reqPayload.buttonId === 'likeButton' ? 'likeItem' : 'unlikeItem';
    return await axios.post(`/api/protected/post/${path}`, reqPayload);
  }, { onSuccess: (res) => {
    switch(res.data.result) {
      case 0:
        throw new Error(res.data.message);
      case 1:
        dispatch({
          type: 'updateFav',
          payload: {
            user: res.data.user,
            errMessage: null
          }
        });
        break;
      case 2:
        throw new Error(res.data.message);
      default:
        throw new Error('Unknown result code');
    }
  }, onError: (err) => {
    console.error(err);
    console.log(err.stack);
  }});

  return (
    <>
      <li className={`${viewContext.view === '' ? 'inline ' : (viewContext.view === itemCategory ? 'inline ' : 'hidden ')} 
      flex flex-col w-full sm:w-fit h-fit md:h-[25rem] sm:h-96 bg-stone-700/20 rounded-[0.375rem] backdrop-blur-sm sm:backdrop-blur-md cursor-pointer`}
      >
        <img className="h-72 object-cover sm:h-fit" src={item.images.url} alt={`${item.title}`} />
        <div className="flex flex-col justify-between md:overflow-hidden px-5 pt-3 h-full">
          <div>
            <div className="text-3xl h-fit sm:text-xl">{item.title}</div>
            <div className="sm:absolute text-xl text-zinc-400">{itemCategory}</div>
          </div>
          <div className="flex justify-between">
            {/* if logged in -> if a add to fav is in progress -> if this item is in favItems*/}
            {(session.user !== 'signed out' && session.user !== false)
            ? (isLoading
                ? 'loading'
                : (session.user.favItems.includes(item._id)
                    ? <img src="./heart-full.png" alt="remove from favourite button"
                        className={`relative top-6 w-[1.5rem] h-[1.5rem] transition-all overflow-hidden hover:w-[1.7rem] hover:h-[1.7rem] hover:-translate-y-[0.1rem] hover:-translate-x-[0.1rem]`}
                        onClick={(e) => {
                          mutate({ 
                            user: session.user, 
                            item: item, 
                            buttonId: e.target.id
                          })}}
                      />
                    : <img src="./heart-white.png" id='likeButton' alt="add to favourite button"
                        className={`relative top-6 w-[1.5rem] h-[1.5rem] transition-all overflow-hidden hover:w-[1.7rem] hover:h-[1.7rem] hover:-translate-y-[0.1rem] hover:-translate-x-[0.1rem]`}
                        onClick={(e) => {
                          mutate({ 
                            user: session.user, 
                            item: item, 
                            buttonId: e.target.id
                          })}}
                      />
                  )
              )
            : <div></div>
            }
            <div className="flex justify-end py-4 sm:pb-4 items-end text-4xl font-bold before:content-['港幣'] before:relative before:md:right-1 before:right-2
            before:text-lg before:font-normal before:text-zinc-400">{item.price}</div>
          </div>
        </div>
      </li>
    </>
  )
}
