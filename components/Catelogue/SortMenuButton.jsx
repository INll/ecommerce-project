import { useSortContext } from "./SortContext"
import { Menu } from '@headlessui/react';

export default function SortMenuButton() {
  const sortContext = useSortContext();
  console.log(sortContext);
  return (
    <Menu.Button className="text-white w-40 text-right">{sortContext.sort}</Menu.Button>
  )
}
